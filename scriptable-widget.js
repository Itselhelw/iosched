// scriptable-widget.js
// ─────────────────────────────────────────────────────────────────────────────
// iOS Scriptable Widget for Weekly Schedule
// 1. Install "Scriptable" app from the App Store.
// 2. Create a new script and paste this code.
// 3. Replace the BASE_URL with your Vercel URL.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://your-project.vercel.app"; // <-- REPLACE WITH YOUR URL
const WIDGET_URL = `${BASE_URL}/api/widget`;

// If you have an iOS Shortcut updating habits, it might save them to a file.
// For now, we fetch the base widget.
let img = await fetchImage(WIDGET_URL);

if (config.runsInWidget) {
  let widget = createWidget(img);
  Script.setWidget(widget);
  Script.complete();
} else {
  // Preview in app
  let widget = createWidget(img);
  await widget.presentMedium();
}

/**
 * Creates the widget layout
 */
function createWidget(img) {
  let w = new ListWidget();
  w.backgroundColor = new Color("#0a0f1e");
  w.setPadding(0, 0, 0, 0);

  let image = w.addImage(img);
  image.applyRoundedCorners(0); // Image already has padding/styling

  // Refresh every 30 minutes
  w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 30);

  w.url = BASE_URL; // Tap widget to open site

  return w;
}

/**
 * Fetches image from URL with error handling
 */
async function fetchImage(url) {
  try {
    let req = new Request(url);
    return await req.loadImage();
  } catch (e) {
    // Return a placeholder if server is down
    let ctx = new DrawContext();
    ctx.size = new Size(720, 340);
    ctx.opaque = true;
    ctx.setFillColor(new Color("#0f172a"));
    ctx.fill(new Rect(0, 0, 720, 340));
    ctx.setFont(Font.boldSystemFont(32));
    ctx.setTextColor(Color.white());
    ctx.drawTextInRect("Update Vercel URL", new Rect(0, 150, 720, 40));
    return ctx.getImage();
  }
}
