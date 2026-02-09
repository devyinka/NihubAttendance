"use client";

import { Attendancecontexprovider } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import { Rolecontexprovider } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 1, // Retry failed requests once
    },
  },
});

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning>
      {mounted ? (
        <QueryClientProvider client={queryClient}>
          <Rolecontexprovider>
            <Attendancecontexprovider>{children}</Attendancecontexprovider>
          </Rolecontexprovider>
        </QueryClientProvider>
      ) : null}
    </div>
  );
}
