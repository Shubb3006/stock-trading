import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useStockStore = create((set) => ({
  stocks: [],
  selectedStock: null,
  fetchingStocks: false,
  fetchingStockDetail: false,
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
}));
