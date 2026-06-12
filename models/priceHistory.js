import mongoose from "mongoose"

const priceHistorySchema=mongoose.Schema({
    stockId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Stock",    
        required:true
    },
    price: {
        type: Number,
        required: true,
      },
    
    createdAt: {
      type: Date,
        default: Date.now,
    },
  })

export default mongoose.models.PriceHistory ||
  mongoose.model("PriceHistory", priceHistorySchema);