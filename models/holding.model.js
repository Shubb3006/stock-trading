import mongoose from "mongoose";

const holdingSchema=mongoose.Schema({
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
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    averageBuyPrice:{
        type: Number,
        required: true,
    }
},{timestamps:true})

export default mongoose.models.Holding ||
mongoose.model("Holding",holdingSchema)