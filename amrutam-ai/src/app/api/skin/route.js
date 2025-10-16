export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!image) throw new Error("No image");

    // Check if we have a backend URL configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (backendUrl) {
      // Use external backend
      const response = await fetch(`${backendUrl}/api/skin`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      const data = await response.json();
      return Response.json(data);
    }

    // Fallback: Return mock data for demo purposes
    const mockData = {
      disease: "Demo Skin Condition",
      confidence: 0.85,
      care: [
        "Apply gentle moisturizer twice daily",
        "Use mild, fragrance-free cleanser",
        "Avoid harsh chemicals and excessive sun exposure"
      ],
      tips: [
        "Keep skin hydrated with adequate water intake",
        "Use natural ingredients like aloe vera",
        "Maintain a balanced diet rich in antioxidants"
      ]
    };
    
    return Response.json(mockData);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { status: 400 });
  }
}
