# Update Guide - Version 1.1.0

## What Changed?

The extension now **works with GitHub's native "Viewed" checkboxes** instead of creating custom ones!

### The Problem
Previously, the extension created its own "Reviewed" checkboxes, but when you clicked GitHub's native "Viewed" button, nothing happened because the extension wasn't listening to those buttons.

### The Solution
The extension now:
- ✅ Hooks into GitHub's native "Viewed" checkboxes
- ✅ Automatically detects when you click them
- ✅ Updates the tracker in real-time
- ✅ Works with various GitHub UI versions

## How to Update

### Step 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "PR Review Tracker"
3. Click the **reload icon (🔄)**

### Step 2: Test It Out
1. Open any GitHub PR's "Files changed" tab
2. Look for the purple tracker box at the top
3. Click GitHub's native "Viewed" checkbox on any file (usually in the top-right corner of each file)
4. **Watch the tracker update automatically!** ✨

## Debugging

If the tracker isn't updating:

1. **Open the Browser Console**
   - Press `F12` (or `Cmd+Option+I` on Mac)
   - Go to the "Console" tab

2. **Look for These Messages**
   ```
   PR Review Tracker: Setting up...
   PR Review Tracker: Found native viewed button for [filename] INPUT name="viewed"
   PR Review Tracker: File [filename] marked as viewed
   ```

3. **If you see "No native viewed button found"**
   - This means GitHub is using a different selector
   - Please report which PR you're testing on so we can add support
   - Check the console for the exact HTML structure

4. **Force a Sync**
   - In the console, type: `tracker.syncWithGitHubButtons()`
   - This manually syncs with GitHub's button states

## What to Expect

### Before Clicking "Viewed"
```
╔═══════════════════════════════════╗
║ Review Progress                   ║
║ Remaining to review:              ║
║ + 245 / 245                      ║
║ − 123 / 123                      ║
║ ░░░░░░░░░░ 0% reviewed           ║
╚═══════════════════════════════════╝
```

### After Clicking "Viewed" on a File with +50 -20 Lines
```
╔═══════════════════════════════════╗
║ Review Progress                   ║
║ Remaining to review:              ║
║ + 195 / 245                      ║  ← Updated!
║ − 103 / 123                      ║  ← Updated!
║ ██░░░░░░░░ 19% reviewed          ║  ← Updated!
╚═══════════════════════════════════╝
```

## Known Issues

### GitHub UI Variations
GitHub occasionally updates their UI, which may change the selector for the "Viewed" button. If you encounter issues:
- Check the console for detection messages
- Report the issue with the specific PR URL you're testing on
- We'll add support for the new selector

### Works Best On
- Modern GitHub PR pages
- "Files changed" tab
- Desktop browsers (Chrome, Edge, Brave, Opera)

## Rollback

If you need to go back to version 1.0.0:
1. The old version is in your git history
2. Run: `git log` to see commits
3. Run: `git checkout <commit-hash>` to revert
4. Reload the extension in `chrome://extensions/`

## Questions?

Check the updated documentation:
- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [CHANGELOG.md](CHANGELOG.md) - All changes

---

**Enjoy seamless PR reviews!** 🎉

