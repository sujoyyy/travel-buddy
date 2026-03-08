import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { fromLocation, toLocation, days, budget } = await req.json();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a travel expert. Output ONLY a valid JSON object.
          Rules:
          1. Use English only and a fun tone. 
          2. Plan for the destination: ${toLocation}.
          3. Provide between 3 to 5 best places to visit (aim for 5 if the budget allows).
          4. Format:
          {
            "intro": "Exciting intro...",
            "places": [
              { "name": "Place Name", "desc": "50-word description", "mapUrl": "Google Maps URL" }
            ],
            "food": "Local dish",
            "budgetDetails": ["Item 1", "Item 2"],
            "totalBudget": "₹Total Amount"
          }`
        },
        {
          role: "user",
          content: `Plan a ${days}-day trip to ${toLocation} from ${fromLocation} with ₹${budget}.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    return new Response(chatCompletion.choices[0]?.message?.content);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}