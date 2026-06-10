import mongoose from "mongoose";
// import  Stock  from '@/models/stock.model';
import Stock from "@/models/stock.model"
const stocks = [
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    currentPrice: 3580,
    sector: "Technology",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    currentPrice: 1650,
    sector: "Technology",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    currentPrice: 1480,
    sector: "Energy",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    currentPrice: 2010,
    sector: "Banking",
  },
  {
    symbol: "ITC",
    name: "ITC Limited",
    currentPrice: 430,
    sector: "FMCG",
  },
];

async function seedStocks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    await Stock.deleteMany();

    await Stock.insertMany(stocks);

    console.log("Stocks seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedStocks();