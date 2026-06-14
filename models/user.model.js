import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cash:{
        type:Number,
        default:10000
    }
    
},{timestamps:true})

export default mongoose.models.User ||
  mongoose.model("User", userSchema);