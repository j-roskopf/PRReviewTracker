# Changelog

All notable changes to the PR Review Tracker extension will be documented in this file.

## [1.4.0] - 2025-10-16

### Changed
- Remove extra permissions

## [1.3.1] - 2025-10-16

### Changed
- **🎨 Icon Update**: Redesigned extension icon with a larger, more prominent checkmark
  - Checkmark now fills the full icon width instead of being quarter-size
  - Added gradient background matching the tracker UI
  - Cleaner, more professional appearance

## [1.3.0] - 2025-10-16

### Added
- **🎉 Celebration Animation**: When you reach 100% review completion, enjoy a fun celebration!
  - Colorful confetti falls from the top of the screen
  - Progress bar transforms into an animated rainbow gradient
  - Tracker pulses with a glowing effect
  - Animation lasts 4 seconds and only plays once per completion
  - Smart triggering: won't play on initial page load or when minimized
- **🐛 Debug Mode**: Toggle debug logging on/off via browser console
  - Run `tracker.debug = true` to enable detailed logging
  - Run `tracker.debug = false` to disable
  - All console logs now respect debug mode setting

### Technical
- Added `showCelebration()` method to trigger confetti and animations
- Added `celebrationShown` flag to prevent duplicate celebrations
- Added `isInitialLoad` flag to prevent celebration on page load
- Added `isMinimized` tracking to skip celebration when tracker is minimized
- Added `debug` property and `log()` method for conditional logging
- CSS animations for confetti falling, rainbow gradient, and tracker glow
- 50 randomly colored confetti pieces with staggered timing
- Celebration automatically cleans up after animation completes

## [1.2.0] - 2025-10-16

### Added
- **Minimize/Expand Button**: Added a minimize button in the top-right corner of the tracker
- **Persistent Minimized State**: The minimized state is saved to preferences and persists across page loads
- When minimized, the tracker shows only the extension name "PR Review Tracker" with an expand button

### Improved
- **Compact UI**: Significantly reduced the size of the tracker (40% less vertical space)
  - Smaller font sizes throughout (14px title, 13px stats, 11px progress text)
  - Reduced padding and margins
  - Thinner progress bar (16px instead of 24px)
- More subtle and less obtrusive design

### Changed
- Renamed internal heading from "Review Progress" to "PR Review Tracker" for clarity when minimized

### Technical
- Added `toggleMinimize()` method to handle minimize/expand functionality
- Added `loadMinimizedState()` method to restore minimized preference on load
- Added CSS for minimize button with hover and active states
- Minimized state stored in Chrome local storage with key `pr-tracker-minimized`

## [1.1.0] - 2025-10-15

### Fixed
- **MAJOR FIX**: Extension now hooks into GitHub's native "Viewed" checkboxes instead of creating custom ones
- Tracker now properly updates when clicking GitHub's built-in "Viewed" button on each file
- Resolved issue where clicking the viewed button had no effect

### Changed
- Removed custom "Reviewed" checkboxes in favor of GitHub's native UI
- Enhanced button detection with comprehensive selectors to support various GitHub UI versions
- Improved state synchronization with GitHub's viewed state
- Added detailed console logging for debugging button detection

### Improved
- Better detection of viewed button across different GitHub UI versions
- More robust event handling using capture phase
- Enhanced mutation observer to track attribute changes on viewed buttons
- Added multiple fallback selectors for viewed button detection

### Technical
- Added `handleViewedButtonClick()` method to handle native button interactions
- Added `syncWithGitHubButtons()` method to sync state with GitHub
- Added `recalculateRemaining()` helper method for cleaner code
- Enhanced mutation observer with attribute filters for `data-file-user-viewed`, `data-file-user-viewed-state`, `aria-checked`, and `checked`
- Cleaned up unused CSS for custom checkboxes

## [1.0.0] - 2025-10-15

### Added
- Initial release of PR Review Tracker
- Real-time tracking of remaining lines to review (+/-)
- File-by-file checkbox review system
- Visual progress bar showing percentage completed
- Persistent state storage using Chrome local storage
- Beautiful gradient UI with sticky positioning
- Dark mode support
- Responsive design for mobile viewing
- Animation effects for smooth UX
- Support for dynamically loaded content (lazy loading)
- Automatic state restoration when revisiting PRs

### Features
- **Progress Tracking**: Shows remaining additions and deletions
- **File Checkboxes**: Mark individual files as reviewed
- **Visual Feedback**: Progress bar and percentage display
- **State Persistence**: Review progress saved per PR URL
- **Modern UI**: Gradient design with smooth animations
- **Responsive**: Works on desktop and mobile
- **Smart Updates**: Real-time calculation as files are checked off

### Technical Details
- Manifest V3 compliance
- Content script injection for GitHub PR pages
- CSS animations and transitions
- MutationObserver for dynamic content
- Chrome Storage API for persistence
- Zero external dependencies

### Supported Platforms
- Chrome (primary)
- Edge
- Brave
- Opera
- Other Chromium-based browsers

---

## Future Roadmap

### [1.1.0] - Planned
- Keyboard shortcuts (e.g., 'r' to toggle reviewed)
- Export review report as markdown
- Customizable themes/colors
- Review time tracking

### [1.2.0] - Planned
- Support for GitLab merge requests
- Support for Bitbucket pull requests
- Team collaboration features
- Review comments integration

### [2.0.0] - Ideas
- AI-powered review suggestions
- Code complexity indicators
- Review checklist templates
- Integration with code review tools

---

## Maintenance Notes

**Version Numbering**: Following Semantic Versioning (SemVer)
- MAJOR version: Incompatible API changes
- MINOR version: New functionality (backwards compatible)
- PATCH version: Bug fixes (backwards compatible)

**Browser Support**: Targeting latest 2 major versions of Chromium-based browsers
