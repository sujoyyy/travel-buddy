import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { mood, budget, location } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are a spontaneous travel buddy. Plan a 1-day trip in ${location} for someone who is feeling ${mood} with a budget of ₹${budget}. Give 3 specific spots and one local food suggestion. Keep it friendly and Desi style.`,
        },
      ],
      model: "llama-3.3-70b-versatile", // Ye model bohot fast hai aur free tier mein chalta hai
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ text: text }));
  } catch (error: any) {
    console.error("Groq Error:", error);
    return new Response(JSON.stringify({ text: "Bhai, Groq bhi gussa hai: " + error.message }), { status: 500 });
  }
}