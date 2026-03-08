// app/api/update/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Remote Update System
// POST /api/update  →  update habits, streaks, progress, or schedule
//
// Since Vercel is stateless, changes are passed as URL params to /api/widget.
// For persistent storage, connect a database (Vercel KV shown below).
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();

    // ── What this endpoint accepts ──────────────────────────────────────────
    // {
    //   habits:      { "German 🇩🇪": true, "Gym 🏋️": true, ... },
    //   streaks:     { "German 🇩🇪": 5, "Gym 🏋️": 4 },
    //   weekProgress: 65,
    //   quote:       "New motivational quote"
    // }

    // For now: build a widget URL with params (stateless approach)
    // When you add Vercel KV (see README), this will persist to a database.

    const params = new URLSearchParams();

    if (body.habits) {
      const vals = Object.values(body.habits).map(v => v ? '1' : '0').join(',');
      params.set('habits', vals);
    }

    if (body.weekProgress !== undefined) {
      params.set('progress', body.weekProgress.toString());
    }

    if (body.day) {
      params.set('day', body.day);
    }

    return Response.json({
      success: true,
      message: 'Widget URL updated',
      widgetUrl: `/api/widget?${params.toString()}`,
      tip: 'Use this URL in your Scriptable widget. To persist data across requests, add Vercel KV storage (see README Step 6).',
    });

  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  return Response.json({
    message: 'POST to this endpoint to update your widget',
    example: {
      habits: { 'German 🇩🇪': true, 'Gym 🏋️': true, 'Cyber 🔐': false, 'College 📚': true, 'Startup 💡': false },
      weekProgress: 65,
      day: 'Friday',
    }
  });
}
