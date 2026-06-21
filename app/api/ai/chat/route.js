import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export async function POST(req){
    try {
        await connectDB();
        const user=await getUserFromCookie(req);

        const {portfolio,question}=await req.json();

        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const prompt = `
        You are an expert portfolio advisor.
        
        Answer the user's question using ONLY the portfolio data provided.
        
        Portfolio Data:
        ${JSON.stringify(portfolio)}
        
        User Question:
        ${question}
        
        Return ONLY valid JSON.
        
        {
          "answer": "",
          "type": "profit|risk|allocation|general",
          "actionItems": [],
          "relatedStocks": [],
          "riskLevel": "Low/Medium/High"
        }
        
        Rules:
        - Keep answer concise (2-4 sentences).
        - Do not use markdown (** or *).
        - Do not explain information not present in the portfolio.
        - actionItems should contain practical recommendations.
        - relatedStocks should contain stock symbols mentioned in the answer.
        `;

            console.log(prompt.length)

            const response = await AI.chat.completions.create({
                model: "gemini-3.5-flash",
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
                answer:content
            })

    } catch (err) {
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