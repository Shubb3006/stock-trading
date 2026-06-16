import dotenv from "dotenv";
import express from "express";
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
import { connectDB } from "./db.js";
import Stock from "./models/Stock.js";
import  PriceHistory  from "./models/priceHistory.js";

const app = express();

dotenv.config();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://stock-trading-ruby.vercel.app","http://localhost:3000"],
    credentials:true // Next.js frontend
  },
});

let stocks = [];

async function loadStocks() {
  await connectDB();

  const dbStocks = await Stock.find();
  console.log(dbStocks)

  stocks = dbStocks.map((s) => ({
    _id: s._id,
    symbol: s.symbol,
    name: s.name,
    sector: s.sector,
    currentPrice: s.currentPrice,
  }));

  console.log("Stocks loaded into WebSocket engine");
}


// store mock prices

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("initialData", stocks);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

console.log(stocks);



// 🔥 PRICE ENGINE (REAL TIME SIMULATION)
// setInterval(() => {
//   stocks = stocks.map((stock) => {
//     const change = (Math.random() - 0.5) * 10;
//     return {
//       ...stock,
//       currentPrice: Number((stock.currentPrice + change).toFixed(2)),
//     };
//   });

//   io.emit("priceUpdate", stocks);
// }, 2000);

setInterval(async () => {
  for (const stock of stocks) {
    const change = (Math.random() - 0.5) * 10;

    const newPrice = Number(
      (stock.currentPrice + change).toFixed(2)
    );

    stock.currentPrice = newPrice;

    await Stock.findByIdAndUpdate(stock._id, {
      currentPrice: newPrice,
    });
    await PriceHistory.create({
      stockId: stock._id,
      price: newPrice,
    });
  }

  io.emit("priceUpdate", stocks);
}, 1000);

server.listen(8000, () => {
    loadStocks();
  console.log("Socket server running on port 5000");
});