class PRReviewTracker {
  constructor() {
    this.initVariables();
    this.initState(true);
  }

  log(...args) {
    if (this.debug) {
      console.log('PR Review Tracker:', ...args);
    }
  }

  initVariables() {
    this.totalAdditions = 0;
    this.totalDeletions = 0;
    this.remainingAdditions = 0;
    this.remainingDeletions = 0;
    this.fileStats = new Map();
    this.trackerElement = null;
    this.initialized = false;
    this.isMinimized = null;
    this.celebrationShown = false;
    this.debug = false; // Set to true to enable debug logging
  }

  initState(addListener) {
    this.log("init state")
    if (document.readyState !== 'loading') {
      this.log("setting listener")
      // Wait for the PageHeader-Navigation element to exist, then wait for its child
      this.waitForElm('[class*="PageHeader-Navigation"]', document)?.then((elm) => {
        this.waitForElm('.fgColor-success', elm)?.then((elm) => {
          this.log("element ready")
          this.setup(addListener);
        });
      });
    
    } else {
      this.log("already loaded")
      document.addEventListener('DOMContentLoaded', () => {
        this.setup(addListener)
      });
    }
  }

  setup(addListener) {
    this.log('setup');

    if (addListener) {
      // Listen for navigation changes (for GitHub's turbo/pjax navigation)
      this.observeNavigationChanges();
    }

    chrome.storage.local.get(['pr-tracker-minimized'], (result) => {
      if (result['pr-tracker-minimized'] === true) {
        this.isMinimized = true;
      } else {
        this.isMinimized = false;
      }
    });

    // Check if we're on a PR page
    if (!this.onPrPage()) {
      return;
    }

    // Extract total stats from the PR header
    if (this.extractTotalStats()) {

      // Parse all file changes
      this.parseFileChanges();

      // Create the tracker UI
      this.createTrackerUI();

      // Set up observers for file checkboxes
      this.observeCheckboxes();

      // Update the display
      this.updateDisplay();

      // Load saved state
      setTimeout(() => this.loadStateBasic(), 500);


      this.initialized = true;
      this.log('Setup complete', {
        totalAdditions: this.totalAdditions,
        totalDeletions: this.totalDeletions,
        filesFound: this.fileStats.size
      });
    } else {
      this.log("Old ui")
    }
  }

  extractTotalStats() {
    let statHeader = document.querySelector('[class*="PageHeader-Navigation"]')
    if (statHeader) {

      // Parse from the summary bar
      const additionsElement = statHeader.querySelector('.fgColor-success');
      const deletionsElement = statHeader.querySelector('.fgColor-danger');

      if (additionsElement) {
        const addText = additionsElement.textContent.replace(/[^0-9]/g, '');
        this.log('Total additions extracted', addText);
        this.totalAdditions = parseInt(addText) || 0;
      } else {
        this.log('No additions element found');
        this.totalAdditions = 0;
      }

      if (deletionsElement) {
        const delText = deletionsElement.textContent.replace(/[^0-9]/g, '');
        this.totalDeletions = parseInt(delText) || 0;
      } else {
        this.totalDeletions = 0;
      }
      // If still zero, try to extract from the "Files changed" tab text
      if (this.totalAdditions === 0 && this.totalDeletions === 0) {
        const filesTab = document.querySelector('[href*="/files"]');
        if (filesTab) {
          const text = filesTab.textContent;
          const addMatch = text.match(/\+(\d+)/);
          const delMatch = text.match(/-(\d+)/);
          if (addMatch) this.totalAdditions = parseInt(addMatch[1]);
          if (delMatch) this.totalDeletions = parseInt(delMatch[1]);
        }
      }

      this.remainingAdditions = this.totalAdditions;
      this.remainingDeletions = this.totalDeletions;

      this.log('Total stats extracted', {
        additions: this.totalAdditions,
        deletions: this.totalDeletions
      });

      return true
    } else {
      return false
    }
  }

  parseFileChanges() {
    // Find all file headers in the diff
    const fileHeaders = document.querySelectorAll('[class*="DiffFileHeader-module__diff-file-header"]');

    fileHeaders.forEach((header) => {

      const fileName = header.querySelector('[class*="DiffFileHeader-module__file-name"]')?.innerText;
      const additions = parseInt(header.querySelector('.fgColor-success')?.innerText) || 0;
      const deletions = parseInt(header.querySelector('.fgColor-danger')?.innerText) || 0;

      if (fileName) {
        this.fileStats.set(fileName, {
          additions: additions,
          deletions: deletions,
          checked: false,
          element: header
        });
      }
    });
  }

  getFileName(header) {
    return header.innerText;
  }

  createTrackerUI() {
    // Create the tracker element
    document.querySelector("#pr-review-tracker")?.remove()
    this.trackerElement = document.createElement('div');
    this.trackerElement.id = 'pr-review-tracker';
    this.trackerElement.className = 'pr-review-tracker-container';

    this.trackerElement.innerHTML = `
      <div class="pr-review-tracker-header">
        <h3 class="pr-review-tracker-title">PR Review Tracker</h3>
        <button class="pr-review-minimize-btn" id="pr-review-minimize-btn" title="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="pr-review-tracker-content" id="pr-review-tracker-content">
        <div class="pr-review-stats">
          <div class="stat-row">
            <span class="stat-label">Remaining to review:</span>
          </div>
          <div class="stat-row additions">
            <span class="stat-icon">+</span>
            <span class="stat-value" id="remaining-additions">${this.remainingAdditions}</span>
            <span class="stat-total">/ ${this.totalAdditions}</span>
          </div>
          <div class="stat-row deletions">
            <span class="stat-icon">−</span>
            <span class="stat-value" id="remaining-deletions">${this.remainingDeletions}</span>
            <span class="stat-total">/ ${this.totalDeletions}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
          <div class="progress-text" id="progress-text">0% reviewed</div>
        </div>
      </div>
    `;

    // Insert the tracker at the top of the page
    const prHeader = document.querySelector('.gh-header-show');
    if (prHeader) {
      prHeader.parentNode.insertBefore(this.trackerElement, prHeader.nextSibling);
    } else {
      document.body.insertBefore(this.trackerElement, document.body.firstChild);
    }

    // Load minimized state and apply it
    this.loadMinimizedState();

    // Add minimize button click handler
    const minimizeBtn = document.getElementById('pr-review-minimize-btn');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    }

    // Add checkboxes to each file header
    this.addFileCheckboxes();
  }

  addFileCheckboxes() {
    // GitHub's native "Viewed" buttons already exist, so we just need to track them
    // We'll identify them and add data attributes for our tracking
    this.fileStats.forEach((stats, fileName) => {
      const fileHeader = stats.element;

      // Skip if we've already processed this file
      if (fileHeader.getAttribute('data-pr-tracker-initialized')) {
        return;
      }

      // Mark as initialized
      fileHeader.setAttribute('data-pr-tracker-initialized', 'true');

      // Find GitHub's native "Viewed" button
      // GitHub uses various selectors for the viewed button across different versions
      const viewedButton = fileHeader.querySelector(
        '[class*="MarkAsViewedButton-module"]'
      );

      if (viewedButton) {

        // Store reference to the native button
        stats.viewedButton = viewedButton;

        // Check if it's already checked (state restoration or already viewed)
        // Use aria-pressed attribute - "true" when viewed, "false" when not viewed
        const isChecked = viewedButton.getAttribute('aria-pressed') === 'true';

        if (isChecked && !stats.checked) {
          stats.checked = true;
          this.recalculateRemaining();
        }
      }
    });
  }

  observeCheckboxes() {
    // Listen for clicks and changes on GitHub's native "Viewed" buttons
    document.addEventListener('click', (e) => {
      this.handleViewedButtonClick(e.target);
    }, true); // Use capture phase to catch events early


    // Observe for dynamically added content (lazy loading)
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      let shouldCheckButtons = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.querySelector('[class*="DiffFileHeader-module__diff-file-header"]')) {
              shouldUpdate = true;
            }
            // Check for viewed button state changes
            if (node.matches && node.matches('[class*="MarkAsViewedButton-module"]')) {
              shouldCheckButtons = true;
            }
          }
        });

        // Also check for attribute changes on viewed buttons
        if (mutation.type === 'attributes' && mutation.target) {
          const target = mutation.target;
          if (target.matches && target.matches('[class*="MarkAsViewedButton-module"]')) {
            shouldCheckButtons = true;
          }
        }
      });

      if (shouldUpdate) {
        this.parseFileChanges();
        this.addFileCheckboxes();
      }

      if (shouldCheckButtons) {
        this.syncWithGitHubButtons();
      }
    });

    const filesContainer = document.querySelector('#files, .js-diff-progressive-container, #files_bucket');
    if (filesContainer) {
      observer.observe(filesContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-pressed', 'aria-label']
      });
    }
  }

  handleViewedButtonClick(target) {
    if (!target) return;

    // Check if this is a viewed button or if we clicked inside one
    let viewedButton = null;

    // First check if the target itself is the viewed button
    if (target.matches && target.matches('[class*="MarkAsViewedButton-module"]')) {
      viewedButton = target;
    } else if (target.closest) {
      // If we clicked on a child element (like SVG or span), find the parent button
      viewedButton = target.closest('[class*="MarkAsViewedButton-module"]');
    }

    if (!viewedButton) return;

    // Find the associated file header
    const fileHeader = viewedButton.closest('[class*="DiffFileHeader-module__diff-file-header"]');
    if (!fileHeader) return;

    // Find the file in our stats
    for (const [fileName, stats] of this.fileStats.entries()) {
      if (stats.element === fileHeader || stats.viewedButton === viewedButton) {
        // Small delay to let GitHub update the button state
        setTimeout(() => {
          // Check aria-pressed attribute (true when viewed, false when not)
          const isChecked = viewedButton.getAttribute('aria-pressed') === 'true';

          if (stats.checked !== isChecked) {
            stats.checked = isChecked;
            this.recalculateRemaining();
            this.saveState();
            this.updateDisplay();
          }
        }, 100);
        break;
      }
    }
  }

  syncWithGitHubButtons() {
    // Sync our state with GitHub's native viewed buttons
    this.fileStats.forEach((stats, fileName) => {
      if (stats.viewedButton) {
        // Use aria-pressed attribute - "true" when viewed, "false" when not viewed
        const isChecked = stats.viewedButton.getAttribute('aria-pressed') === 'true';

        if (stats.checked !== isChecked) {
          stats.checked = isChecked;
        }
      }
    });

    this.recalculateRemaining();
    this.updateDisplay();
  }

  recalculateRemaining() {
    // Recalculate remaining stats based on checked files
    this.remainingAdditions = this.totalAdditions;
    this.remainingDeletions = this.totalDeletions;

    this.fileStats.forEach((stats) => {
      if (stats.checked) {
        this.remainingAdditions -= stats.additions;
        this.remainingDeletions += stats.deletions;
      }
    });
  }

  handleCheckboxChange(fileName, checked) {
    const fileData = this.fileStats.get(fileName);
    if (!fileData) return;

    fileData.checked = checked;

    // Recalculate remaining stats
    this.recalculateRemaining();

    // Save state to storage
    this.saveState();

    // Update the display
    this.updateDisplay();
  }

  updateDisplay() {
    const additionsElement = document.getElementById('remaining-additions');
    const deletionsElement = document.getElementById('remaining-deletions');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    if (additionsElement) additionsElement.textContent = this.remainingAdditions;
    if (deletionsElement) deletionsElement.textContent = this.remainingDeletions;

    // Calculate progress percentage
    const totalLines = this.totalAdditions + this.totalDeletions;
    const reviewedLines = (this.totalAdditions - this.remainingAdditions) +
      (this.totalDeletions - this.remainingDeletions);
    const percentage = totalLines > 0 ? Math.round((reviewedLines / totalLines) * 100) : 0;

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${percentage}% reviewed`;
    }

    // Check if we just reached 100%
    // Don't celebrate on initial page load, only when actively reaching 100%
    if (percentage === 100 && !this.celebrationShown && this.isMinimized == false) {
      this.celebrationShown = true;
      this.showCelebration();
    } else if (percentage < 100) {
      this.celebrationShown = false;
    }
  }

  showCelebration() {
    // Don't show celebration if tracker is minimized
    if (this.trackerElement && this.trackerElement.classList.contains('minimized')) {
      return;
    }

    // Add celebration class to container
    if (this.trackerElement) {
      this.trackerElement.classList.add('celebrating');
    }

    // Create confetti container
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'pr-review-confetti-container';

    // Add confetti pieces
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3', '#54a0ff', '#48dbfb'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'pr-review-confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confettiContainer.appendChild(confetti);
    }

    document.body.appendChild(confettiContainer);

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
      if (this.trackerElement) {
        this.trackerElement.classList.remove('celebrating');
      }
    }, 4000);
  }

  saveState() {
    const prUrl = window.location.href;
    const state = {
      checkedFiles: Array.from(this.fileStats.entries())
        .filter(([_, stats]) => stats.checked)
        .map(([fileName, _]) => fileName)
    };

    chrome.storage.local.set({ [prUrl]: state });
  }

  toggleMinimize() {
    const isMinimized = this.trackerElement.classList.toggle('minimized');

    // Update button icon and title
    const minimizeBtn = document.getElementById('pr-review-minimize-btn');
    if (minimizeBtn) {
      if (isMinimized) {
        minimizeBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `;
        minimizeBtn.title = 'Expand';
      } else {
        minimizeBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `;
        minimizeBtn.title = 'Minimize';
      }
    }

    // Save preference
    chrome.storage.local.set({ 'pr-tracker-minimized': isMinimized });
  }

  loadMinimizedState() {
    chrome.storage.local.get(['pr-tracker-minimized'], (result) => {
      if (result['pr-tracker-minimized'] === true) {
        this.trackerElement.classList.add('minimized');

        // Update button icon
        const minimizeBtn = document.getElementById('pr-review-minimize-btn');
        if (minimizeBtn) {
          minimizeBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `;
          minimizeBtn.title = 'Expand';
        }
      }
    });
  }

  loadStateBasic() {
    this.recalculateRemaining();
    this.updateDisplay();

    // Also sync with any GitHub buttons that are already checked
    setTimeout(() => this.syncWithGitHubButtons(), 100);
  }

  observeNavigationChanges() {
    // GitHub uses turbo/pjax for navigation, listen for URL changes
    let lastUrl = window.location.href;
    new MutationObserver(() => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        document.querySelector("#pr-review-tracker")?.remove()
        if (this.onPrPage()) {
          // Reinitialize when navigating to files tab
          this.log('URL changed, reinitializing');
          this.initVariables();
          this.initState(false);
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }


  onPrPage() {
    return window.location.href.includes('/files') && window.location.href.includes('github.com')
  }

  waitForElm(selector, parent) {
      return new Promise(resolve => {
          if (parent.querySelector(selector)) {
              return resolve(parent.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
              if (parent.querySelector(selector)) {
                  observer.disconnect();
                  resolve(parent.querySelector(selector));
              }
          });

          // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
  }
}

// Initialize the tracker
const tracker = new PRReviewTracker();

// Load saved state after a short delay to ensure all elements are ready
setTimeout(() => {
  tracker.loadStateBasic();
}, 500);

