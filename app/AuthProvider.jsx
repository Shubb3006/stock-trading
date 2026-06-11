// "use client";

// import { useEffect } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import { Loader2 } from "lucide-react";

// export default function AuthProvider({ children }) {
//   const { checkAuth,isCheckingAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }
//   return children;
// }

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
}