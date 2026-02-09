"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Reset loading when pathname changes
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    // Create a wrapper around router.push to show loading
    const originalPush = router.push;
    router.push = (...args) => {
      setLoading(true);
      return originalPush.apply(router, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #7741c3, #9f67ff, #7741c3)",
        backgroundSize: "200% 100%",
        zIndex: 99999,
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
