import { NextResponse } from "next/server";
import  Stock  from '@/models/stock.model';
import  PriceHistory from '@/models/priceHistory';
import { connectDB } from "@/lib/db";

export async function POST() {
    try {
        await connectDB();
  
    const stocks = await Stock.find();
  
    for (const stock of stocks) {
      stock.currentPrice = Number(
        (stock.currentPrice + (Math.random() - 0.5) * 4).toFixed(2)
      );
  
      await stock.save();
  
      await PriceHistory.create({
        stockId: stock._id,
        price: stock.currentPrice,
      });
    }
  
    return NextResponse.json({ success: true, stocks });
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