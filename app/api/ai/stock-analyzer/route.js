import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function POST(req){
    try{
        await connectDB();
        const data=await req.json();
       

        const prompt = `
            You are a professional stock market analyst.

            Analyze this stock using:
            1. Current stock information
            2. Historical price movement
            3. Trend strength
            4. Risk level

            IMPORTANT:
            - Do NOT hallucinate company fundamentals.
            - Only use the provided data.
            - If data is insufficient, mention it.
            - Return ONLY valid JSON.

            {
              "summary":"",
              "trend":"Bullish/Bearish/Sideways",
              "riskLevel":"Low/Medium/High",
              "strengths":[],
              "weaknesses":[],
              "keyObservations":[],
              "verdict":"Buy/Hold/Sell",
              "confidenceScore":0
            }

            Confidence score should be between 1 and 10.

            Stock Data:
            ${JSON.stringify(data)}
        `;
        const response = await AI.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
            temperature:0.7,
        });

        let content=response.choices[0].message.content;
        content = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        
        return NextResponse.json({
            status:200,
            analysis:content
        })
               
    }catch(err){
        console.log(err.message)
        if (err.status === 429) {
            return NextResponse.json(
              {
                message: "AI service is busy. Please try again in a few moments."
              },
              { status: 429 }
            );
          }
        return NextResponse.json(
            {status:"error",message:"Something went wrong while analyzing the stock."},
            {status:500}
        )
    }
}


