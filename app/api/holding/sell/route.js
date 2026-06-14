import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import  Stock  from '@/models/stock.model';
import { NextResponse } from "next/server";
import Holding from '@/models/holding.model';
import  Transaction  from '@/models/transaction.model';

export async function POST(req){
    try {
        await connectDB();
        const user=await getUserFromCookie(req);

       if (!user) {
          return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 }
          );
        }
    
        const { stockId, quantity } = await req.json();
        const sellQty=Number(quantity);

        const stock = await Stock.findById(stockId);

        const totalCost = quantity * stock.currentPrice;
        user.cash+=totalCost;
        await user.save();
    
        if (!stockId || !sellQty || sellQty <= 0) {
          return NextResponse.json(
            { status: "error", message: "Invalid input" },
            { status: 400 }
          );
        }
    
        const holding = await Holding.findOne({
            userId: user._id,
            stockId,
        });
        

        if(!holding){
            return NextResponse.json(
                {status:"error" ,message:"You don't own this stock"},
                {status:400} 
            )
        }

        await holding.populate("stockId")
        if (sellQty > holding.quantity) {
            return NextResponse.json(
              { status: "error", message: "Not enough quantity to sell" },
              { status: 400 }
            );
          }

        holding.quantity -= sellQty;
        const sellPrice = holding.stockId.currentPrice;
        const pnl = sellQty * (sellPrice - holding.averageBuyPrice);

        const tran=await Transaction.create({
            userId: user._id,
            stockId,
            type: "SELL",
            quantity: sellQty,
            price: stock.currentPrice,
            totalAmount: sellQty * stock.currentPrice,
            realizedPnl: pnl,
          });


        if (holding.quantity === 0) {
            await Holding.deleteOne({ _id: holding._id });
      
            return NextResponse.json({
              status: "success",
              message: "Holding sold completely",
              holding: null,
              pnl
            });
          }
          
           
        await holding.save();
        await holding.populate("stockId");

        return NextResponse.json({
          status: "success",
          holding,
          pnl
        });
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