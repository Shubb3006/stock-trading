import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import  Transaction  from '@/models/transaction.model';
import { NextResponse } from "next/server";
import "@/models/stock.model"

export async function GET(req){
    try {
       
        await connectDB();
        const user=await getUserFromCookie(req);
        const { searchParams } = new URL(req.url);
        const type=searchParams.get("type");
       

        if (!user) {
          return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
          );
        }
        const query={userId:user._id}
        if(type && type!=="ALL"){
            if(type==="CASH"){
                query.type={$in:["DEPOSIT","WITHDRAW"]}
            }
    
            if(type==="TRADES"){
                query.type={$in:["BUY","SELL"]}
            }
        }
        
        // const transactions=await Transaction.find({userId:user._id}).populate("stockId","symbol name  sector").sort({createdAt:-1})
        const transactions=await Transaction.find(query).populate("stockId").sort({createdAt:-1})
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