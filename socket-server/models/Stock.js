import mongoose from "mongoose"

const stockSchema=mongoose.Schema({
    symbol:{
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
   
    name:{
        type: String,
        required: true,
    },
    currentPrice:{
        type:Number,
        required: true,
    },
    sector:{
        type:String,
        required: true,
    }
},{timestamps:true})

export default mongoose.models.Stock ||
  mongoose.model("Stock", stockSchema);