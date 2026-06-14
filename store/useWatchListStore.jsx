import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useWatchListStore = create((set) => ({
  watchList: [],
  isFetchingWatchList: false,
  isAddingToWatchList: false,
  isDeletingFromWatchList: false,

  getWatchList: async () => {
    try {
      set({ isFetchingWatchList: true });
      const res = await axiosInstance.get("/watchlist");
      console.log(res.data.watchlist);
      set({ watchList: res.data.watchlist });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isFetchingWatchList: false });
    }
  },

  addToWatchList: async (data) => {
    try {
      set({ isAddingToWatchList: true });
      const res = await axiosInstance.post("/watchlist", data);
      set((state) => ({
        watchList: [...state.watchList, res.data.watchlist],
      }));
      toast.success("Added to your watchlist");
    } catch (error) {
    } finally {
      set({ isAddingToWatchList: false });
    }
  },
  deleteFromWatchList: async (stockId) => {
    try {
      set({ isDeletingFromWatchList: true });
      const res = await axiosInstance.delete(`/watchlist/${stockId}`);
      set((state) => ({
        watchList: state.watchList.filter(
          (item) => item.stockId._id !== stockId
        ),
      }));
      toast.success("Removed from your watchlist");
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isDeletingFromWatchList: false });
    }
  },
}));
