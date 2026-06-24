import mongoose from "mongoose";

const transactionSchema=mongoose.Schema({
    stockId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type:{
        type:String,
        enum:["BUY","SELL","DEPOSIT","WITHDRAW"],
        required:true
    },
    quantity: {
        type: Number,
    },
  
    price: {
        type: Number,
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