// /api/update-prices/route.js
import { connectDB } from '@/lib/db';
import  Stock  from '@/models/stock.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const stocks = await Stock.find();
  
    for (const stock of stocks) {
      const change = (Math.random() - 0.5) * 10;
  
      stock.currentPrice = Math.max(
        10,
        stock.currentPrice + change
      );
  
      await stock.save();
    }
  
    return NextResponse.json({
      success: true,
    });
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