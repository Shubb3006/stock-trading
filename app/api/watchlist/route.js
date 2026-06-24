import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Watchlist from "@/models/watchlist.model";
import { NextResponse } from "next/server";
import "@/models/stock.model";

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

        const watchlist=await Watchlist.find({userId:user._id}).populate("stockId")
        return NextResponse.json(
            {status:"success" , watchlist},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {status:"error",message:error.message},
            {status:500}
        )
    }
}

export async function POST(req){
    try {
        await connectDB();
        const {stockId}=await req.json();
        const user=await getUserFromCookie(req);
        
        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const existing=await Watchlist.findOne({
            stockId:stockId,
            userId:user._id
        })

        if(existing)
            return NextResponse.json(
                { status: "error", message: "Stock is already in your watchlist" },
                { status: 409 }
            );

        const watchlist=await Watchlist.create({
            stockId:stockId,
            userId:user._id
        })
        await watchlist.populate("stockId")
        return NextResponse.json(
            {status:"success", watchlist},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {status:"error",message:error.message},
            {status:500}
        )
    }
}

