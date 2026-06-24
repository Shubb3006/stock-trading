import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User  from '@/models/user.model';
import { NextResponse } from "next/server";
import  Transaction from '@/models/transaction.model';

export async function  GET(req){
    try{
        await connectDB();
        const user=await getUserFromCookie(req);
        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }

        const userDetail=await User.findById(user._id).select("-password")

        if (!userDetail) {
            return NextResponse.json(
              { status: "error", message: "User not found" },
              { status: 404 }
            );
          }
        return NextResponse.json(userDetail)
    }catch (err) {
        console.log(err);
        return NextResponse.json(
          { status: "error", message: "Internal Server Error" },
          { status: 500 }
        );
      }
}

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

        const data=await req.json();

        const updatedData={};
        if(data.name) updatedData.name=data.name;

       const updated=await User.findByIdAndUpdate(user._id,
        {$set:updatedData},
        {new:true})
        .select("-password");
        
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