import { getUserFromCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import  Watchlist  from '@/models/watchlist.model';
import { NextResponse } from 'next/server';
export async function DELETE(req,{params}){
    try {
        await connectDB();
        const user=await getUserFromCookie(req);

        if (!user) {
            return NextResponse.json(
              { status: "error", message: "Unauthorized" },
              { status: 401 }
            );
        }


        const { stockId } = await params;

        const watchlist=await Watchlist.findOne({
            userId: user._id,
            stockId
        })

        if(!watchlist)
             return NextResponse.json(
                    { status: "error", message: "Stock is not in your watchlist" },
                    { status: 409 }
                );

        await Watchlist.deleteOne({
            userId: user._id,
            stockId
        });
        
        return NextResponse.json({
            status: "success",
            message: "Removed from watchlist"
        });

    } catch (error) {
        return NextResponse.json(
            {status:"error",message:error.message},
            {status:500}
        )
    }
}