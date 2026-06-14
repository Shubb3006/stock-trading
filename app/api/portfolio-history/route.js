import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Holding from '@/models/holding.model';
import PortfolioHistory from "@/models/portfolioHistory.model";
import "@/models/stock.model"

export async function POST(req){
    try {
        await connectDB();
        const user=await getUserFromCookie(req);

        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const latest = await PortfolioHistory.findOne({
            userId:user._id,
         }).sort({ createdAt: -1 });

         const oneHourAgo = Date.now() - 60 * 60 * 1000;
         let history = latest;

         if (
            !latest ||
            new Date(latest.createdAt).getTime() < oneHourAgo
          ) {
            const holdings=await Holding.find({userId:user._id}).populate("stockId");
            let totalInvested=0; 
            let totalValue=0;

            holdings.forEach((h)=>{
                totalInvested+=h.averageBuyPrice*h.quantity;
                totalValue+=h.stockId.currentPrice*h.quantity
            })
            history =await PortfolioHistory.create({
              userId:user._id,
              totalValue,
              totalInvested,
              totalPnL:totalValue-totalInvested,
            });
          }
        return NextResponse.json({status:200, history})
    } catch (error) {
        return NextResponse.json(
            {
              success: false,
              message: error.message,
            },
            { status: 500 }
          );
    }
}

export async function GET(req){
    try {
        await connectDB();
        const user=await getUserFromCookie(req);

        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const portfolioHistory=await PortfolioHistory.find({userId:user._id}).sort({createdAt:1});

        return NextResponse.json({status:200, portfolioHistory})
    } catch (error) {
        return NextResponse.json(
            {
              success: false,
              message: error.message,
            },
            { status: 500 }
          );
    }
}