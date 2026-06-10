import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import  Stock  from '@/models/stock.model';

export async function GET(req,{params}){
    try {
        await connectDB();
        const {symbol}=await params;

        const stock = await Stock.findOne({
            symbol
          });

        if (!stock) {
            return NextResponse.json(
              { message: "Stock not found" },
              { status: 404 }
            );
        }
        return NextResponse.json(stock);
      
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
          );
    }
}

export async function PATCH(req,{params}){
    try {
        await connectDB();
        const {symbol}=await params;

        const stock = await Stock.findOne({
            symbol
          });

        if (!stock) {
            return NextResponse.json(
              { message: "Stock not found" },
              { status: 404 }
            );
        }

        stock.currentPrice =stock.currentPrice + Math.floor(Math.random()*100  - 50);
        await stock.save(); 
        return NextResponse.json(stock);
      
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
          );
    }
}