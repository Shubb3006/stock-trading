import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import  User  from "@/models/user.model";
import  Transaction  from '@/models/transaction.model';
import { NextResponse } from "next/server";

export async function PATCH(req){
    try{
        await connectDB();
        const user=await getUserFromCookie(req);
        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const {amount}=await req.json();
        const depositedAmount=Number(amount);

        if (!depositedAmount || depositedAmount <= 0) {
            return NextResponse.json(
              { message: "Invalid amount" },
              { status: 400 }
            );
          }


       const updated=await User.findByIdAndUpdate(user._id,
        {$inc:{cash:depositedAmount}},
        {new:true})
        .select("-password");

        await Transaction.create({
                userId: user._id,
                type: "DEPOSIT",
                totalAmount: depositedAmount
              });
       return NextResponse.json(updated)
    }
    catch (err) {
        console.log(err); 
        return NextResponse.json(
          { status: "error", message: err.message || "Internal Server Error" },
          { status: 500 }
        );
      }
}