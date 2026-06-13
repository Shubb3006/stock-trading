import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import  Transaction  from '@/models/transaction.model';
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const { searchParams } = new URL(req.url);
        const page=parseInt(searchParams.get("page"))||1
        const limit=parseInt(searchParams.get("limit"))||10

        const skip=(page-1)*limit
        await connectDB();
        const user=await getUserFromCookie(req);

        if (!user) {
          return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
          );
        }

        const transactions=await Transaction.find({userId:user._id}).populate("stockId","symbol name currentPrice sector").sort({createdAt:-1}).skip(skip).limit(limit)

        return NextResponse.json(
            {status:"success" ,transactions},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {status:"error",message:error.message},
            {status:500}
        )
    }
}