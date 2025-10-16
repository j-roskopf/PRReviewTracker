# 🚀 Quick Start Guide

## Install in 60 Seconds

### 1️⃣ Open Chrome Extensions
```
chrome://extensions/
```
Or: **Menu (⋮) → Extensions → Manage Extensions**

### 2️⃣ Enable Developer Mode
Toggle the switch in the **top-right corner** → ON (blue)

### 3️⃣ Load the Extension
Click **"Load unpacked"** → Navigate to:
```
/Users/jrosko/Code/pr-review-tracker
```
Click **"Select"**

### 4️⃣ Test It!
Go to any GitHub PR:
- Example: https://github.com/microsoft/vscode/pulls (pick any PR)
- Click "Files changed" tab
- See the purple tracker box appear! ✨

## ✅ What You'll See

### At the Top of the PR:
```
╔═══════════════════════════════════╗
║ Review Progress                   ║
║ Remaining to review:              ║
║ + 245 / 245                      ║
║ − 123 / 123                      ║
║ ██░░░░░░░░ 20% reviewed          ║
╚═══════════════════════════════════╝
```

### On Each File:
```
📄 src/components/App.js  [☐ Viewed]  +87 -23
                          ↑
              Click GitHub's native "Viewed" checkbox!
```

## 🎯 How to Use

1. **Review a file** in the PR diff
2. **Check GitHub's native "Viewed" checkbox** when done (usually top-right of each file)
3. **Watch the tracker update** automatically:
   - Remaining lines decrease
   - Progress bar fills up
   - Percentage increases
4. **Come back later** - your progress is saved!

## 🎮 Try the Demo First

Before installing, preview the extension:
```bash
open /Users/jrosko/Code/pr-review-tracker/demo.html
```

Click the checkboxes to see the tracker update in real-time!

## 🔧 Troubleshooting

**Extension doesn't appear?**
- ✅ Make sure you're on a GitHub PR page
- ✅ Click the "Files changed" tab
- ✅ Refresh the page (⌘+R or F5)

**Can't find "Load unpacked"?**
- ✅ Developer Mode must be ON (top-right toggle)

**Tracker not updating?**
- ✅ Make sure you're clicking GitHub's native "Viewed" checkbox
- ✅ Open browser console (F12) and look for "PR Review Tracker:" messages
- ✅ Scroll down to load file diffs
- ✅ Some files load lazily - scroll to see them

## 📚 Full Documentation

- **Complete guide**: [README.md](README.md)
- **Installation steps**: [INSTALL.md](INSTALL.md)
- **Version history**: [CHANGELOG.md](CHANGELOG.md)
- **Overview**: [SUMMARY.md](SUMMARY.md)

## 💡 Pro Tips

- **Sticky header**: The tracker stays visible as you scroll
- **Auto-save**: Progress saves automatically per PR
- **Mobile friendly**: Works on mobile GitHub too
- **Dark mode**: Adapts to your GitHub theme

## 🎉 You're Done!

The extension is now tracking your PR reviews. Happy reviewing! 🚀

---

**Need help?** Check the full [README.md](README.md) or open an issue.
