import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import PriceHistory from "@/models/priceHistory";
import Stock from "@/models/stock.model";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { symbol } = await params;
    console.log(symbol)

    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return NextResponse.json(
        { message: "Stock not found" },
        { status: 404 }
      );
    }

    const history = await PriceHistory.find({
      stockId: stock._id,
    }).sort({ createdAt: 1 })

    const count = await PriceHistory.countDocuments({
      stockId: stock._id,
    });

    // if (count > 10000) {
    //     const oldestRecords = await PriceHistory.find({
    //       stockId: stock._id,
    //     })
    //       .sort({ createdAt: 1 })
    //       .limit(count - 10000);
      
    //     await PriceHistory.deleteMany({
    //       _id: { $in: oldestRecords.map((r) => r._id) },
    //     });
    //   }

    return NextResponse.json({count:history.length, history});
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}