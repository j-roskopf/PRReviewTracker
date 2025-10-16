# PR Review Tracker - Chrome Extension

A Chrome extension that helps you track your progress while reviewing GitHub pull requests. It displays the remaining lines of code (+/-) to review and lets you check off files as you complete them.

## Features

- 📊 **Real-time Progress Tracking**: See remaining additions and deletions at a glance
- ✅ **Works with GitHub's Native "Viewed" Buttons**: Automatically syncs with GitHub's built-in file viewed checkboxes
- 💾 **Persistent State**: Your review progress is saved and restored when you revisit the PR
- 📈 **Visual Progress Bar**: See your overall review progress percentage
- 🎨 **Beautiful UI**: Clean, modern interface with gradient design
- 🌙 **Dark Mode Support**: Automatically adapts to your GitHub theme

## Installation

### Option 1: Load as Unpacked Extension (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked"
4. Navigate to the `pr-review-tracker` folder and select it
5. The extension is now installed and active!

### Option 2: Package and Install

1. In Chrome, go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select the `pr-review-tracker` folder as the extension root directory
5. Click "Pack Extension"
6. Chrome will create a `.crx` file that you can share and install

## Usage

### ⚠️ Important: Use the "Files changed" Tab

The extension works on the **"Files changed"** tab of GitHub PRs, not the conversation tab.

1. **Navigate to a GitHub Pull Request**: Open any PR on GitHub (e.g., `https://github.com/owner/repo/pull/123`)

2. **Click the "Files changed" Tab**: This is where you see the actual code diffs

3. **View the Tracker**: At the top of the page, you'll see a purple gradient box showing:
   - Total additions and deletions
   - Remaining additions and deletions to review
   - Progress percentage
   - Visual progress bar

4. **Mark Files as Reviewed**: Use GitHub's native "Viewed" checkbox (usually in the top-right corner of each file). The extension automatically detects when you click it!

5. **Watch Progress Update**: As you check off files, the tracker automatically updates:
   - Remaining line counts decrease
   - Progress bar fills up
   - Percentage increases

6. **State Persistence**: Your progress is automatically saved. If you close the tab and come back later, your checkboxes will be restored.

### Quick Test

To verify the extension is working:

1. Go to any GitHub PR's "Files changed" tab (e.g., https://github.com/microsoft/vscode/pulls - pick any open PR)
2. Look for the purple tracker box at the top
3. Click GitHub's native "Viewed" checkbox on any file
4. Watch the tracker update automatically!

**If you don't see the tracker box**, check the [Troubleshooting Guide](TROUBLESHOOTING.md).

## How It Works

The extension:
1. Parses the PR diff to extract line change statistics for each file
2. Hooks into GitHub's native "Viewed" checkboxes to detect when you mark files as reviewed
3. Calculates remaining lines based on which files are checked off
4. Saves your progress to Chrome's local storage (per PR URL)
5. Updates the display in real-time as you interact with the viewed buttons
6. Syncs automatically with GitHub's state, even if files are marked as viewed by GitHub itself

## Files Structure

```
pr-review-tracker/
├── manifest.json       # Extension configuration
├── content.js          # Main logic for tracking and UI
├── styles.css          # Styling for the tracker UI
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
└── README.md           # This file
```

## Permissions

The extension requires:
- **activeTab**: To access the current GitHub PR page
- **storage**: To save your review progress
- **host_permissions** for `https://github.com/*`: To inject the tracker into GitHub PR pages

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires manifest conversion for Firefox MV2/MV3)

## Debug Mode

To enable debug logging for troubleshooting:

1. Open the browser console (F12 or Cmd+Option+I)
2. Type: `tracker.debug = true` and press Enter
3. Debug messages will now appear in the console with the prefix "PR Review Tracker:"
4. To disable: `tracker.debug = false`

This is helpful for debugging issues with button detection, file parsing, or state management.

## Customization

You can customize the appearance by editing `styles.css`:
- Change the gradient colors in `.pr-review-tracker-container`
- Adjust spacing and sizing
- Modify the progress bar colors
- Update the checkbox styling

## Troubleshooting

**The tracker doesn't appear:**
- Make sure you're on a GitHub PR page (URL contains `/pull/`)
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page

**Tracker not updating when clicking "Viewed":**
- Check the browser console (F12) for any error messages
- Look for messages starting with "PR Review Tracker:"
- Make sure you're clicking GitHub's native "Viewed" checkbox (usually top-right of each file)
- Try refreshing the page and reload the extension

**Progress not saving:**
- Check that sion has storage permissions
- Look for errors in the browser console (F12)

## Future Enhancements

Potential features for future versions:
- Export review progress as a report
- Keyboard shortcuts for checking off files
- Customizable color themes
- Support for other code review platforms (GitLab, Bitbucket)
- Review time tracking
- Team collaboration features

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PR Review Tracker card
4. Reload the GitHub PR page to see your changes

## License

MIT License - feel free to use and modify as needed!

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Made with ❤️ for better code reviews**
