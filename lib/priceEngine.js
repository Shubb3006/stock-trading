import Stock from "@/models/stock.model";

export async function updateStockPrices() {
  const stocks = await Stock.find();

  for (const stock of stocks) {
    const change = (Math.random() - 0.5) * 2;

    stock.currentPrice = Math.max(
      1,
      stock.currentPrice + change
    );

    await stock.save();
  }
}