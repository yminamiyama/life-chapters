"use client";

import { isMockEnabled } from "@/lib/api-client";
import { LogIn, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DemoBanner = () => {
  const [visible, setVisible] = useState(() => isMockEnabled());
  const [bottomOffset, setBottomOffset] = useState(24); // px
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => setVisible(isMockEnabled());

    const onStorage = (e: StorageEvent) => {
      if (e.key === "timebucket_demo_mode") {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("timebucket-demo-toggle", refresh as EventListener);
    const resize = () => {
      if (typeof window !== "undefined") {
        setBottomOffset(window.innerWidth < 768 ? 120 : 24);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("timebucket-demo-toggle", refresh as EventListener);
      window.removeEventListener("resize", resize);
    };
  }, [pathname]);

  if (!visible) return null;

  const exitDemo = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("timebucket_demo_mode");
      const url = new URL(window.location.href);
      url.searchParams.delete("demo");
      window.dispatchEvent(new Event("timebucket-demo-toggle"));
      window.location.href = "/login";
    }
  };

  return (
    <div
      className="fixed z-[60] left-4 right-4 pointer-events-none"
      style={{
        bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottomOffset}px)`,
      }}
    >
      <div className="mx-auto max-w-sm rounded-2xl border border-primary/20 bg-white/95 shadow-lg backdrop-blur px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto md:mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Info size={18} className="text-primary" />
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">デモモード</p>
            <p className="text-xs text-slate-500">この表示はサンプルデータです。ログインすると実データを管理できます。</p>
          </div>
        </div>
        <button
          onClick={exitDemo}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/90 shadow-sm"
        >
          <LogIn size={16} />
          ログインへ
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
