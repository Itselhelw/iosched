// app/api/update/route.js
export const runtime = 'edge';

export async function GET(req) {
    return new Response(JSON.stringify({
        message: "Remote update system ready.",
        instructions: "To update your widget data live, you have two options:",
        option1: {
            method: "Manual Git Update",
            steps: [
                "1. Open data/schedule.json in your GitHub repo.",
                "2. Edit the habits, streaks, or schedule.",
                "3. Commit changes. Vercel will redeploy in seconds."
            ]
        },
        option2: {
            method: "Dynamic URL Params (Recommended for iOS Shortcuts)",
            description: "Pass data directly in your widget URL.",
            example: "https://your-project.vercel.app/api/widget?habits=1,1,0,1,1&progress=85",
            param_info: {
                habits: "Comma-separated 1s and 0s for [College, German, Cyber, Gym, Startup]",
                progress: "A number between 0 and 100",
                day: "Optional: override today's day name"
            }
        }
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
