import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1];

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Bloom Branding Context
        const systemInstruction = `You are the AI assistant for Bloom Branding, a premium creative agency.
    Your tone is professional, confident, elevated, and helpful.
    
    About Bloom Branding:
    - We help startups, D2C brands, and creators build confident, strategic brand identities.
    - Services: Brand Strategy, Identity Design, Web Development, Content Creation.
    - Contact: Direct users to the contact form for specific quotes.
    
    Rules:
    - Be concise.
    - If asked about pricing, explain that it is tailored and suggest contacting us.
    - Do not make up fake team members.
    - Use "We" to represent the agency.
    `;

        // Construct the prompt with context
        const prompt = `${systemInstruction}\n\nUser: ${latestMessage.text}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
