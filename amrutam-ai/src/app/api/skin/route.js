export const runtime = "nodejs";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image) throw new Error("No image");

    // Create a new FormData to forward
    const newFormData = new FormData();
    newFormData.append("image", image);

    console.log("Sending request to:", `${BACKEND_URL}/api/skin`);
    
    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/skin`, {
      method: "POST",
      body: newFormData,
      // Explicitly don't set Content-Type header, let fetch set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", response.status, errorText);
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (e) {
    console.error("API route error:", e);
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
