import mongoose from "mongoose";

const watchListSchema=mongoose.Schema({
    stockId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})



export default mongoose.models.Watchlist ||
  mongoose.model("Watchlist", watchListSchema);