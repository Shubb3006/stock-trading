import mongoose from "mongoose";

const transactionSchema=mongoose.Schema({
    stockId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type:{
        type:String,
        enum:["BUY","SELL"],
        required:true
    },
    quantity: {
        type: Number,
        required: true,
    },
  
    price: {
        type: Number,
        required: true,
    },
  
    totalAmount: {
        type: Number,
        required: true,
    },
    realizedPnl: {
        type: Number,
        default: 0,
    },
},{timestamps:true})

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);