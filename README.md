# 📱 iOS Weekly Schedule Widget (Senior Engineer Guide)

This project is a high-performance, server-side rendered (SSR) widget generation system designed specifically for the iPhone 14 Plus home screen.

## 🏗 System Architecture

The system follows a "Server-Generated Image" pattern to bypass the limitations of iOS widget development (Swift/App Store) while maintaining a premium, dynamic UI.

1.  **Rendering Engine**: Powered by `@vercel/og` (Satori). It transforms HTML/CSS into optimized SVG and then to PNG in a serverless Edge environment.
2.  **Edge Runtime**: Minimal latency (< 50ms) by running code at the edge closest to the user.
3.  **Data Layer**: Centralized `data/schedule.json`.
4.  **Client Bridge**: Scriptable.js (iOS) fetches the image and handles the widget lifecycle.

## 📁 File Structure

```text
iosched/
├── api/
│   ├── widget.js       # The "Brain" - generates the PNG image
│   └── update.js       # Instructions for remote data updates
├── data/
│   └── schedule.json   # Your schedule, habits, and streaks
├── scriptable-widget.js# The iOS client (install via Scriptable app)
├── vercel.json         # Vercel deployment configuration
├── package.json        # Dependencies (Satori layout engine)
└── README.md           # This guide
```

## 🎨 Design System

The widget uses a **Layer-Based Design**:
- **Layer 1 (Background)**: Deep slate gradient `#0a0f1e` to `#0f172a`.
- **Layer 2 (Header)**: Dynamic time/date with Cairo timezone.
- **Layer 3 (Day Strip)**: Visual calendar with habit/lecture markers.
- **Layer 4 (Task Blocks)**: Color-coded cards with glassmorphism borders (`border: 1px solid white/10%`).
- **Layer 5 (Bottom Bar)**: Live habit checkboxes, streak counters, and a gradient progress bar.

## 🚀 Deployment (Step-by-Step)

### 1. Vercel Hosting
- Push this folder to a GitHub repository.
- Connect your repo to **Vercel**.
- Vercel will automatically detect the `api/` folder and deploy the edge functions.
- Once deployed, copy your URL (e.g., `https://iosched.vercel.app`).

### 2. iOS Widget Setup
- Install the **Scriptable** app on your iPhone.
- Create a new script, name it "Schedule".
- Paste the contents of `scriptable-widget.js`.
- **CRITICAL**: Update the `BASE_URL` at the top of the script with your Vercel URL.
- Go to your iPhone home screen, add a **Medium Scriptable Widget**, and select your "Schedule" script.

## 🔄 Dynamic Updates

### Method A: Manual (Permanent)
Edit `data/schedule.json` and push to GitHub. Vercel will redeploy your "source of truth".

### Method B: Live (Shortcuts)
You can append query parameters to the URL in your Scriptable script to override data without a redeploy:
`https://url/api/widget?habits=1,1,0,1,0&progress=75`

---
*Developed for 3-semester college completion goals.*
