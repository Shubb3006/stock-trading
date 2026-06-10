import { connectDB } from "@/lib/db";
import Stock from "@/models/stock.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { symbol, name, currentPrice, sector } =
      await req.json();

    const existingStock = await Stock.findOne({
      symbol,
    });

    if (existingStock) {
      return NextResponse.json(
        { message: "Stock already exists" },
        { status: 400 }
      );
    }

    const stock = await Stock.create({
      symbol,
      name,
      currentPrice,
      sector,
    });

    return NextResponse.json(
      {
        success: true,
        stock,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
    try {
        await connectDB();
        const stocks=await Stock.find();
        return NextResponse.json({
            status: "success",
            stocks,
        },{status:200})
    } catch (error) {
        return NextResponse.json(
            {
              success: false,
              message: error.message,
            },
            { status: 500 }
          );
    }
    
}