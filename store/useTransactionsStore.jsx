import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  isFetchingTransactions: false,

  getAllTransactions: async (type = "") => {
    try {
      set({ isFetchingTransactions: true });
      const res = await axiosInstance.get(`/transactions?type=${type}`);
      set({ transactions: res.data.transactions });
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isFetchingTransactions: false });
    }
  },
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
}));
