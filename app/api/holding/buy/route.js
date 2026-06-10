import { getUserFromCookie } from "@/lib/auth";
import { NextResponse } from "next/server";
import Holding from "@/models/holding.model";
import { connectDB } from "@/lib/db";
import Stock from "@/models/stock.model";
import Transaction from "@/models/transaction.model";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getUserFromCookie(req);

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }



    const { stockId, quantity } = await req.json();

    const finalquantity=Number(quantity);
    if (!stockId || !finalquantity || finalquantity <= 0) {
      return NextResponse.json(
        { status: "error", message: "Invalid input" },
        { status: 400 }
      );
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return NextResponse.json(
        { status: "error", message: "Stock not found" },
        { status: 404 }
      );
    }

    let updatedHolding;

    const existing = await Holding.findOne({
      userId: user._id,
      stockId,
    });

    if (existing) {
      const newQty = existing.quantity + finalquantity;

      const newAvg =
        (existing.quantity * existing.averageBuyPrice +
            finalquantity * stock.currentPrice) /
        newQty;

      existing.quantity = newQty;
      existing.averageBuyPrice = newAvg;

      updatedHolding=await existing.save();
    } else {
        updatedHolding=await Holding.create({
        userId: user._id,
        stockId,
        quantity:finalquantity,
        averageBuyPrice: stock.currentPrice,
      });
    }
    await Transaction.create({
        userId: user._id,
        stockId,
        type: "BUY",
        quantity: finalquantity,
        price: stock.currentPrice,
        totalAmount: finalquantity * stock.currentPrice,
      });
    await updatedHolding.populate("stockId");
    // const holdings = await Holding.find({
    //   userId: user._id,
    // }).populate("stockId");

    return NextResponse.json(
      {
        status: "success",
        holding:updatedHolding,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}