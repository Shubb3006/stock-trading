import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { socket } from "@/lib/socket";

export const useWatchListStore = create((set) => ({
  watchList: [],
  isFetchingWatchList: false,
  isAddingToWatchList: false,
  isDeletingFromWatchList: false,

  getWatchList: async () => {
    try {
      set({ isFetchingWatchList: true });
      const res = await axiosInstance.get("/watchlist");
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

  //  connectSocket: () => {
  //     socket.on("priceUpdate", (updatedStocks) => {
  //       set({
  //         watchList: updatedStocks,
  //       });
  //     });
  //   },

  connectSocket: () => {
    socket.on("priceUpdate", (updatedStocks) => {
      set((state) => ({
        watchList: state.watchList.map((item) => {
          const updatedStock = updatedStocks.find(
            (s) => s._id === item.stockId._id
          );

          if (!updatedStock) return item;

          return {
            ...item,
            stockId: {
              ...item.stockId,
              currentPrice: updatedStock.currentPrice,
            },
          };
        }),
      }));
    });
  },
}));
