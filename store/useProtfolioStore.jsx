import axiosInstance from "@/lib/axios";
import { create } from "zustand";

export const usePortfolioStore = create((set) => ({
  portfolioHistory: [],
  isFetchingPortfolioHistory: false,
  isCreatingPortfolioSnapshot: false,

  getPortfolioHistory: async () => {
    try {
      set({ isFetchingPortfolioHistory: true });
      const res = await axiosInstance.get("/portfolio-history");
      set({ portfolioHistory: res.data.portfolioHistory });
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      set({ isFetchingPortfolioHistory: false });
    }
  },

  createPortfolioSnapshot: async () => {
    try {
      set({ isCreatingPortfolioSnapshot: true });
      const res = await axiosInstance.post("/portfolio-history");
      set((state) => {
        const exists = state.portfolioHistory.some(
          (item) => item._id === res.data.history._id
        );
  
        if (exists) return state;
  
        return {
          portfolioHistory: [
            ...state.portfolioHistory,
            res.data.history,
          ],
        };
      });
    } catch (error) {
    } finally {
      set({ isCreatingPortfolioSnapshot: false });
    }
  },
}));
