# 🖥️ Greeny127.github.io

A personal portfolio that is, against all modern advice, a fully working retro OS**** running in your browser - and which one you get depends entirely on what you're holding it on.

**[greeny127.github.io](https://greeny127.github.io/)**

There is no "About Me" page. There is a `Notepad.exe`. There is no project grid. There is a `Project Explorer.exe`. Load it on desktop and you get Windows 95. Load it on your phone and you get, uncoincidentally, a phone from the era phones started doing this.

## 🖥️ Desktop: Windows 95

Boot it up, log in with literally any password, and get dropped onto a desktop you can drag, resize, minimize, and mildly vandalize.

- **A real window manager** - draggable, resizable, minimizable, maximizable windows
- **A taskbar** - Start menu, running-app buttons, a live clock, and a system tray with a working volume flyout
- **Actual apps**, not just static pages:
  - 🧮 **Calculator** that calculates
  - 📝 **Notepad** with real file-save
  - 📁 **System Folder** - a mock file explorer you can navigate
  - 🌐 **Project Explorer** - my past projects, browsable like files
  - 🗑️ **Recycle Bin** - delete a desktop icon and it really goes here (and can be restored)
  - 🎨 **Display Properties** - right-click the desktop, change the wallpaper color, feel powerful
  - 📄 **My Resume**, rendered inline
- **A right-click context menu** with Arrange Icons, New Text Document, and Properties, because a desktop without one just feels wrong

## 📱 Mobile: iPhone OS 1

Open the same URL on a phone and the Windows 95 desktop doesn't just shrink to fit - it gets swapped out entirely for a from-scratch recreation of the original 2007 iPhone, chunky bezel and all.

- **A lock screen** - drag the knob, or don't and watch it snap back
- **The original status bar** - dot-based signal bars, carrier name, and a battery meter, all fake obviously
- **A glossy home screen grid + dock**, both fully functional, not decoration
- **Its own set of apps**, skinned to match:
  - 🧭 **Projects** (in a Safari-shaped icon) - tap into any project for the full writeup
  - 🗂️ **Files** - a tiny nested folder browser
  - 📝 **My Resume** - inline PDF viewer, with a fallback link out
  - ⚙️ **Settings** - toggle Wi-Fi and Bluetooth (bravely, to nothing), drag a real brightness slider
  - 🖼️ **Photos** - a tap-to-preview album
  - 🧮 **Calculator** - yes, another calculator, because consistency

## Running it locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Resize the window (or open dev tools' device toolbar) to flip between the two versions.

## Deploying

```bash
npm run deploy
```

Builds and pushes to GitHub Pages.

## Stack

React (Create React App), `react-draggable` for window dragging, [`crt-terminal`](https://www.npmjs.com/package/crt-terminal) for the (scrapped) boot sequence, HTML and CSS.