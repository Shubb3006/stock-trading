import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import User from '@/models/user.model';
import { generateToken } from "@/lib/util";
import { connectDB } from "@/lib/db";

export async function POST(req){
    try{
        await connectDB();
        const {email,password}=await req.json();
        if(!email?.trim()){
            return NextResponse.json(
                {status:"error",message:"Email is required"},
                {status:400}
            )
        }
        if(!password?.trim()){
            return NextResponse.json(
                {status:"error",message:"Password is required"},
                {status:400}
            )
        }
        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json(
                {status:"error",message:"User does not exists"},
                {status:400}
            )
        }

        const checkPassword=await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return NextResponse.json(
                {status:"error",message:"Invalid Credentials"},
                {status:400}
            )
        }

        const res = NextResponse.json({
            status: "success",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              isAdmin:user.isAdmin
            },
          });
          generateToken(user._id,res);
          return res
      
    }catch(err){
        console.log(err.message)
        return NextResponse.json(
            {status:"error",message:"Internal Server Error"},
            {status:500}
        )
    }
}