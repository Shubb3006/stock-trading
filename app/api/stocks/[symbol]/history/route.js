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

    const searchParams=req.nextUrl.searchParams;
    const range=searchParams.get("range") || "1HR";


    let startDate;
    switch(range){
     

      case "1D":
        startDate=new Date(Date.now()-24*60*60*1000);
        break;

      case "5D":
        startDate=new Date(Date.now()-5*24*60*60*1000);
        break;
      
      case "1M":
        startDate=new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;

      case "1Y":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;

      case "5Y":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;

      default:
        startDate=new Date(Date.now()-60*60*1000);
        break;
    }


    const history = await PriceHistory.find({
      stockId: stock._id,
      createdAt: { $gte: startDate }
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

    return NextResponse.json({count:history.length, history},{statue:200});
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}