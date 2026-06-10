import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { generateToken } from "@/lib/util";

export async function POST(req,res){
    try{
        await connectDB();
        const { name, email, password } = await req.json();
        if(!name?.trim()){
            return NextResponse.json(
                {status:"error",messsage:"Name is required"},
                {status:400}
            )
        }
        if(!email?.trim()){
            return NextResponse.json(
                {status:"error",messsage:"Email is required"},
                {status:400}
            )
        }
        if(!password?.trim()){
            return NextResponse.json(
                {status:"error",messsage:"Password is required"},
                {status:400}
            )
        }

        const existingUser=await User.findOne({email:email.toLowerCase()})
        if(existingUser){
            return NextResponse.json(
                {status:"error",message:"User Already exists, Try to Login"},
                {status:400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email:email.toLowerCase(),
            password: hashedPassword,
          });
          
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