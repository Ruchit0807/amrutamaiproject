export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image) throw new Error("No image");

    // Check if we have a backend URL configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!backendUrl) {
      return new Response(
        JSON.stringify({ error: "Missing NEXT_PUBLIC_API_URL. Configure Python backend URL in Netlify env." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Forward to external Python backend with multipart form-data
    const upstream = new FormData();
    // Preserve filename and content-type if available (Next.js provides a Blob/File)
    upstream.append(
      'image',
      image,
      typeof image.name === 'string' && image.name.length > 0 ? image.name : 'upload.jpg'
    );

    const response = await fetch(`${backendUrl}/api/skin`, {
      method: 'POST',
      body: upstream,
      // Let fetch set proper multipart boundary headers
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
