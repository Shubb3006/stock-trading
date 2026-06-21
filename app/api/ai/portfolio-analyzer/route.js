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
        const user=await getUserFromCookie(req);
        const data=await req.json();

        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const prompt=`
        Analyze this stock portfolio


        Analyze this portfolio and return ONLY valid JSON.

        {
            "summary": "",
            "riskLevel": "Low/Medium/High",
            "diversificationScore": "",
            "strengths": [],
            "weaknesses": [],
            "suggestions": []
        }

        Portfolio:${JSON.stringify(data)}
        `

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


