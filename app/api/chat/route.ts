import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // CHANGE 1: Read 'messages' and 'currentPath' together at the start (Read body ONCE)
        const { messages, currentPath } = await req.json();

        const conversationHistory = messages
            .map((m: any) => `${m.isUser ? 'User' : 'Assistant'}: ${m.text}`)
            .join('\n');

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // KEEPING YOUR MODEL CHOICE
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // (Removed the second req.json() call here to prevent crash)

        // Bloom Branding Context
        const systemInstruction = `You are the AI assistant for Bloom Branding.
    Your goal is to convert visitors into clients for our creative agency.
    
    About Bloom Branding:
    - We help startups, D2C brands, and creators build confident, strategic brand identities.
    - Services: Brand Strategy, Identity Design, Web Development, Content Creation.
    - Contact: Direct users to the contact form for specific quotes.
    
    KEY RULES:
    1. ONLY answer questions related to branding, web design, marketing, and our agency.
    2. If the user asks about unrelated topics (math, coding, history, poems), politely refuse: "I specialize in branding and design. Let's focus on building your business."
    3. Keep answers short (under 3 sentences) unless asked for details.
    4. Always sound enthusiastic and premium.
    CRITICAL RULES:
    1. If a user asks for pricing, says they want to hire us, or asks to contact us, YOU MUST provide this exact link in your response: "[Book a Strategy Call](/contact)".
    2. Do not just give the URL. Use the markdown format: [Text](/contact).
    3. Be persuasive. Example: "I'd love to help you build that. You can [Book a Strategy Call](/contact) with our team."
    More Rules:
    - Be concise.
    - If asked about pricing, explain that it is tailored and suggest contacting us.
    - Do not make up fake team members.
    - Use "We" to represent the agency.
    `;

        // CHANGE 2: Build the 'contextPrompt' BEFORE generating content
        const contextPrompt = `
        ${systemInstruction}

        Current User Context: The user is currently browsing the "${currentPath}" page of our website. 
        If they are on "/services", focus on explaining our offers.
        If they are on "/contact", encourage them to fill the form.
        `;

        // CHANGE 3: Use 'contextPrompt' instead of just 'systemInstruction'
        const prompt = `${contextPrompt}\n\nConversation So Far:\n${conversationHistory}\nAssistant:`;

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