import mongoose from "mongoose"

const portfolioHistorySchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",    
        required:true
    },
    totalValue: {
      type: Number,
      required: true,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
    cash:{
      type:Number,
    },
    totalPnL: {
      type: Number,
      default: 0,
    },
  },{timestamps:true})

export default mongoose.models.PortfolioHistory ||
  mongoose.model("PortfolioHistory", portfolioHistorySchema);