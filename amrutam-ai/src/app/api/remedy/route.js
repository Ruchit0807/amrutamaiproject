export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { symptoms } = await request.json();
    const textInput = (symptoms || "").toString();
    if (!textInput.trim()) throw new Error("No symptoms provided");

    // Check if we have a backend URL configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (backendUrl) {
      // Use external backend
      const response = await fetch(`${backendUrl}/api/remedy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: textInput }),
      });
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
      
      const data = await response.json();
      return Response.json(data);
    }

    // Fallback: Return mock data for demo purposes
    const mockData = {
      structured: {
        disease: textInput,
        understanding: "This is a demo response. Please configure a backend URL for full functionality.",
        herbs: [
          "Tulsi (Holy Basil) - 2-3 leaves with warm water",
          "Ginger (Adrak) - Small piece with honey",
          "Turmeric (Haldi) - 1/4 tsp with warm milk"
        ],
        home_remedies: [
          "Drink warm water throughout the day",
          "Maintain regular sleep schedule",
          "Practice deep breathing exercises"
        ],
        lifestyle: [
          "Follow a balanced diet",
          "Engage in light physical activity",
          "Maintain stress-free environment"
        ]
      },
      text: "This is a demo response. Please configure NEXT_PUBLIC_API_URL environment variable to connect to the Python backend."
    };
    
    return Response.json(mockData);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Invalid request" }), { status: 400 });
  }
}
