import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAiStore = create((set) => ({
  portfolioAnalysis: null,
  isAnalysingPortfolio: false,

  isAnalysingStock: false,
  stockAnalysis: null,

  isAnsweringQuestion: false,
  answer: null,

  analyzePortfolio: async (portfolioData) => {
    try {
      set({ isAnalysingPortfolio: true });
      const res = await axiosInstance.post(
        "/ai/portfolio-analyzer",
        portfolioData
      );
      const parsedAnalysis = JSON.parse(res.data.analysis);
      set({
        portfolioAnalysis: parsedAnalysis,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to analyze stock");
      console.log(error.message);
    } finally {
      set({ isAnalysingPortfolio: false });
    }
  },

  analyzeStock: async (stockData) => {
    try {
      set({ stockAnalysis: null });
      set({ isAnalysingStock: true });
      const res = await axiosInstance.post("/ai/stock-analyzer", stockData);
      const parsedAnalysis = JSON.parse(res.data.analysis);
      set({ stockAnalysis: parsedAnalysis });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to analyze Portfolio"
      );
      console.log(error?.response?.data?.message);
    } finally {
      set({ isAnalysingStock: false });
    }
  },

  aiChat: async ({ question, portfolio }) => {
    try {
      set({ isAnsweringQuestion: true });
      const res = await axiosInstance.post("/ai/chat", { question, portfolio });
      const parsedAnalysis = JSON.parse(res.data.answer);
      console.log(parsedAnalysis);
      set({ answer: parsedAnalysis });
    } catch (error) {
      console.log(error?.response?.data?.message);
    } finally {
      set({ isAnsweringQuestion: false });
    }
  },

  clearAnalyzeStock: async () => {
    set({ stockAnalysis: null });
  },
}));
