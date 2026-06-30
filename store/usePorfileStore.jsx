import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import { useTransactionsStore } from "./useTransactionsStore";
import toast from "react-hot-toast";

export const useProfilestore = create((set) => ({
  profile: null,
  isFetchingProfile: false,
  isAddingMoney: false,
  isWithdrawingMoney: false,
  getProfileInfo: async () => {
    try {
      set({ isFetchingProfile: true });
      const res = await axiosInstance.get("/profile");
      set({ profile: res.data.user });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  clearProfile:async()=>{
    set({profile:null})
  },
  addMoney: async ({ amount }) => {
    try {
      set({ isAddingMoney: true });
      const res = await axiosInstance.patch("/profile/deposit", { amount });
      set((state) => ({
        profile: {
          ...state.profile,
          cash: res.data.user.cash,
        },
      }));
      toast.success("Money Added")
      useTransactionsStore.getState().addTransaction(res.data.transaction);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error.message);
    } finally {
      set({ isAddingMoney: false });
    }
  },
  withdrawMoney: async ({ amount }) => {
    try {
      set({ isWithdrawingMoney: true });
      const res = await axiosInstance.patch("/profile/withdraw", { amount });
      console.log(res.data.user);
      set((state) => ({
        profile: {
          ...state.profile,
          cash: res.data.user.cash,
        },
      }));
      toast.success("Money Withdrawn")
      
      useTransactionsStore.getState().addTransaction(res.data.transaction);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error.message);
    } finally {
      set({ isWithdrawingMoney: false });
    }
  },
}));
