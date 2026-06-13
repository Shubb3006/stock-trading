import axiosInstance from "@/lib/axios";
import { socket } from "@/lib/socket";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useStockStore = create((set) => ({
  stocks: [],
  intervalId: null,
  livePrices: {},
  selectedStock: null,
  fetchingStocks: false,
  refreshingStocks: false,
  fetchingStockDetail: false,

  priceHistory: [],
  fetchingHistory: false,

  getPriceHistory: async (symbol) => {
    try {
      set({
        fetchingHistory: true,
      });
      const res = await axiosInstance.get(`/stocks/${symbol}/history`);

      set({
        priceHistory: res.data.history,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ fetchingHistory: false });
    }
  },
  refreshPriceHistory: async (symbol) => {
    try {
      const res = await axiosInstance.get(`/stocks/${symbol}/history`);

      set({
        priceHistory: res.data.history,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getStocks: async () => {
    try {
      set({ fetchingStocks: true });
      const res = await axiosInstance.get("/stocks");
      set({ stocks: res.data.stocks });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ fetchingStocks: false });
    }
  },

  clearPriceHistory: async () => {
    set({
      priceHistory: [],
    }),
      console.log("sd");
  },

  refreshStocks: async () => {
    const res = await axiosInstance.post("/stocks/update-price");

    set((state) => ({
      stocks: state.stocks.map((oldStock) => {
        const updated = res.data.stocks.find((s) => s._id === oldStock._id);

        return updated
          ? {
              ...oldStock,
              currentPrice: updated.currentPrice,
            }
          : oldStock;
      }),
    }));
    // set({ stocks: res.data.stocks });
  },

  getStockDetail: async (symbol) => {
    try {
      set({ fetchingStockDetail: true });
      set({ selectedStock: null });
      const res = await axiosInstance.get(`/stocks/${symbol}`);
      set({ selectedStock: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ fetchingStockDetail: false });
    }
  },

  connectSocket: () => {
    socket.on("priceUpdate", (stocks) => {
      const priceMap = {};

      stocks.forEach((s) => {
        priceMap[s._id] = s.currentPrice;
      });

      set({ livePrices: priceMap });
    });
  },
}));
