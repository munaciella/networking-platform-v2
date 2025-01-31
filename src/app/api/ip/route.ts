export async function GET(request: Request) {
    const ip = request.headers.get("x-forwarded-for") || "Unknown IP";
    console.log("Vercel Edge Server IP:", ip);
    return new Response(`Server IP: ${ip}`);
  }