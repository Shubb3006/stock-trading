import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Holding from "@/models/holding.model";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        await connectDB();
        const user = await getUserFromCookie(req);
        
        if (!user) {
          return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
          );
        }

        const holdings=await Holding.find({userId:user._id}).populate("stockId");
        return NextResponse.json(
            { status: "success", holdings },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {status:"error",message:"Internal Server Error"},
            {status:500}
        )
    }
}