import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import  Transaction  from '@/models/transaction.model';
import { NextResponse } from "next/server";
import  User  from '@/models/user.model';

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
        const {amount}=await req.json()

        const withdrawAmount=Number(amount);
        if(!withdrawAmount || withdrawAmount<=0){
            return NextResponse.json(
              { message: "Invalid amount" },
              { status: 400 }
            );
        }


        const userDoc = await User.findById(user._id);

        if(userDoc.cash<withdrawAmount){
          return NextResponse.json(
           
            { message:"Insufficient Funds"},
            {status:400},
          )
        }

       const updated=await User.findByIdAndUpdate(user._id,
        {$inc:{cash:-withdrawAmount}},
        {returnDocument:"after"})
        .select("-password");

        const transaction=await Transaction.create({
                userId: user._id,
                type: "WITHDRAW",
                totalAmount: withdrawAmount
              });
        return NextResponse.json({ user:updated,transaction},{status:200})
    }
    catch (err) {
        console.log(err); 
        return NextResponse.json(
          { status: "error", message: err.message || "Internal Server Error" },
          { status: 500 }
        );
      }
}