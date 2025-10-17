export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { symptoms } = await request.json();
    const textInput = (symptoms || "").toString();
    if (!textInput.trim()) throw new Error("No symptoms provided");

    // Check if we have a backend URL configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!backendUrl) {
      return new Response(
        JSON.stringify({ error: "Missing NEXT_PUBLIC_API_URL. Configure Python backend URL in Netlify env." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use external Python backend
    const response = await fetch(`${backendUrl}/api/remedy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: textInput }),
    });
    
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Backend error: ${response.status} ${body}`);
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { status: 400 });
  }
}
