"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useStockStore } from "@/store/useStockStore";

export default function SocketProvider({ children }) {
  const { connectSocket } = useStockStore();

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
        console.log("Connected:", socket.id);
      });
      
      socket.on("connect_error", (err) => {
        console.log("Socket error:", err.message);
      });

    connectSocket();

    return () => {
      socket.off("priceUpdate");
      socket.disconnect();
    };
  }, []);

  return children;
}