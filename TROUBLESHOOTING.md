# Troubleshooting Guide

## Debug Mode

For any troubleshooting, enable debug mode first:

1. Open the browser console (F12 or Cmd+Option+I)
2. Type: `tracker.debug = true` and press Enter
3. Debug messages will now appear with detailed information
4. To disable: `tracker.debug = false`

This will help you see what the extension is detecting and where issues might be occurring.

---

## Issue: Extension doesn't show total line counts

### Root Cause
The extension needs to be on the **"Files changed"** tab of the PR to see the diff statistics. The main conversation tab doesn't show individual file diffs.

### Solution Steps:

1. **Reload the Extension:**
   - Go to `chrome://extensions/`
   - Find "PR Review Tracker"
   - Click the reload icon 🔄

2. **Navigate to Files Changed Tab:**
   - Open any GitHub Pull Request
   - Click the **"Files changed"** tab at the top
   - The purple tracker box should appear with the correct +/- counts

3. **Check Browser Console for Errors:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Go to the "Console" tab
   - Look for messages starting with "PR Review Tracker:"
   - You should see:
     ```
     PR Review Tracker: Setting up...
     PR Review Tracker: Total stats extracted { additions: X, deletions: Y }
     PR Review Tracker: Setup complete { totalAdditions: X, totalDeletions: Y, filesFound: Z }
     ```

4. **Verify the Extension is Running:**
   - On a PR page, open the console (F12)
   - Type: `document.querySelector('#pr-review-tracker')`
   - If it returns `null`, the extension didn't initialize
   - If it returns an element, the extension is running

### Common Issues:

**Problem:** Tracker shows "0 / 0" for both additions and deletions

**Fixes:**
1. Make sure you're on the "Files changed" tab, not the "Conversation" tab
2. Wait a few seconds for the page to fully load
3. GitHub might be using lazy loading - scroll down to load file diffs
4. Try refreshing the page (F5 or Cmd+R)

**Problem:** Clicking "Viewed" doesn't update the tracker

**Fixes:**
1. Open the browser console (F12) and look for "PR Review Tracker:" messages
2. Check if the extension found the viewed buttons (you should see messages like "Found native viewed button for...")
3. Try reloading the extension in chrome://extensions/
4. Make sure you're clicking GitHub's native "Viewed" checkbox (usually in the top-right of each file header)
5. GitHub may be using a different selector - check console for button detection messages
6. Try on a different PR to see if it's a page-specific issue

**Problem:** Extension doesn't work at all

**Fixes:**
1. Verify the extension is enabled in `chrome://extensions/`
2. Check that you're on `github.com/*/pull/*/files`
3. Clear browser cache and reload
4. Try in an incognito window to rule out conflicts

### Debug Mode:

To see detailed logging, open the browser console (F12) and you'll see messages like:
- "PR Review Tracker: Setting up..."
- "PR Review Tracker: Total stats extracted"  
- "PR Review Tracker: Setup complete"

### Quick Test:

1. Go to: https://github.com/microsoft/vscode/pull/228924/files
2. You should see:
   - Purple tracker box at the top
   - Checkboxes labeled "Reviewed" next to each file
   - Total line counts displayed

### Still Not Working?

If the extension still doesn't work:

1. **Check manifest matches:**
   ```json
   "matches": ["https://github.com/*/pull/*"]
   ```

2. **Verify content.js is being injected:**
   - Right-click on the page → Inspect
   - Go to Sources tab
   - Look for "content.js" under Content Scripts

3. **Try a different PR:**
   Some PRs might have unusual structures. Try:
   - https://github.com/facebook/react/pulls (pick any open PR)
   - Click "Files changed" tab

### Report an Issue:

If none of these work, please provide:
- Browser and version
- Screenshot of the console (F12 → Console tab)
- The PR URL you're testing with
- Any error messages shown
