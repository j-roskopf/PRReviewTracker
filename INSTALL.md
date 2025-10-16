# Quick Installation Guide

## Step-by-Step Installation Instructions

### 1. Open Chrome Extensions Page
- Open Google Chrome
- Type `chrome://extensions/` in the address bar and press Enter
- OR click the three dots menu → Extensions → Manage Extensions

### 2. Enable Developer Mode
- Look for the "Developer mode" toggle in the top-right corner
- Click it to turn it ON (it should be blue/enabled)

### 3. Load the Extension
- Click the "Load unpacked" button (appears after enabling Developer mode)
- A file browser will open
- Navigate to: `/Users/jrosko/Code/pr-review-tracker`
- Click "Select" or "Open"

### 4. Verify Installation
- You should see "PR Review Tracker" appear in your extensions list
- Make sure the toggle switch is ON (blue)
- You should see the extension icon

### 5. Test It Out
- Go to any GitHub Pull Request (e.g., https://github.com/microsoft/vscode/pull/123456)
- Scroll down to the "Files changed" tab
- You should see:
  - A purple gradient box at the top showing review progress
  - "Reviewed" checkboxes next to each file

### 6. Using the Extension
- Check off files as you review them
- Watch the remaining +/- counts decrease
- See your progress percentage increase
- Your progress is automatically saved!

#roubleshooting

**Can't find "Load unpacked"?**
→ Make sure Developer mode is enabled (toggle in top-right)

**Extension appears but doesn't work?**
→ Make sure you're on a GitHub PR page (URL like github.com/*/pull/*)
→ Try refreshing the page (F5 or Cmd+R)

**Checkboxes not appearing?**
→ Click on the "Files changed" tab in the PR
→ Scroll down to see the file diffs

## Updating the Extension

If you make changes to the code:
1. Go to `chrome://extensions/`
2. Find "PR Review Tracker"
3. Click the refresh/reload icon 🔄
4. Refresh any open GitHub PR pages

---

Need help? Check the full README.md for more details!
