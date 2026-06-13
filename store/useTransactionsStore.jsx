import axiosInstance from "@/lib/axios";
import { create } from "zustand";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  isFetchingTransactions: false,

  getAllTransactions: async () => {
    try {
      set({ isFetchingTransactions: true });
      const res = await axiosInstance.get(`/transactions`);
      set({ transactions: res.data.transactions });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isFetchingTransactions: false });
    }
  },
}));
