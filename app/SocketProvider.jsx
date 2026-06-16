"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useStockStore } from "@/store/useStockStore";

export default function SocketProvider({ children }) {
  const { connectSocket } = useStockStore();

  useEffect(() => {
    socket.connect();

    connectSocket();

    return () => {
      socket.off("priceUpdate");
      socket.disconnect();
    };
  }, []);

  return children;
}