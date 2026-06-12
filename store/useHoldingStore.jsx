import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useTransactionsStore } from "./useTransactionsStore";

export const useHoldingStore = create((set) => ({
  holdings: [],
  isFetchingHoldings: false,
  isBuyingStock: false,
  isSellingStock: false,
  clearHoldings: () => set({ holdings: [] }),

  getHoldings: async () => {
    try {
      set({ isFetchingHoldings: true });
      const res = await axiosInstance.get("/holding");
      set({ holdings: res.data.holdings });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isFetchingHoldings: false });
    }
  },

  buyStock: async (data) => {
    try {
      set({ isBuyingStock: true });
      const res = await axiosInstance.post("/holding/buy", data);
      const newHolding = res.data.holding;
      set((state) => {
        const existingIndex = state.holdings.findIndex(
          (h) => h._id === newHolding._id
        );

        if (existingIndex !== -1) {
          const updated = [...state.holdings];
          updated[existingIndex] = newHolding;

          return { holdings: updated };
        } else {
          return {
            holdings: [...state.holdings, newHolding],
          };
        }
      });
      await useTransactionsStore.getState().getAllTransactions();

      toast.success("Stock Bought");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isBuyingStock: false });
    }
  },
  sellStock: async (data) => {
    try {
      set({ isSellingStock: true });
      const res = await axiosInstance.post("/holding/sell", data);
      const updatedHolding = res.data.holding;
      set((state) => {
        // if holding deleted
        if (!updatedHolding) {
          return {
            holdings: state.holdings.filter(
              (h) => h.stockId._id !== data.stockId
            ),
          };
        }

        // update existing holding
        const updated = state.holdings.map((h) =>
          h._id === updatedHolding._id ? updatedHolding : h
        );

        return { holdings: updated };
      });
      await useTransactionsStore.getState().getAllTransactions();
      toast.success("Stock sold");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSellingStock: false });
    }
  },
}));
