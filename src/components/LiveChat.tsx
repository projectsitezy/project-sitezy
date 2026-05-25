import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ChatSettings = {
  provider?: "tawk" | "crisp" | "none";
  embedId?: string;
};

declare global {
  interface Window {
    Tawk_API?: { hideWidget?: () => void; showWidget?: () => void };
    Tawk_LoadStart?: Date;
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

export function LiveChat() {
  const { data } = useQuery({
    queryKey: ["public", "chat-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "chat")
        .maybeSingle();
      return (data?.value as ChatSettings) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!data?.provider || data.provider === "none" || !data.embedId) return;

    let injected: HTMLScriptElement | null = null;

    if (data.provider === "tawk") {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      injected = document.createElement("script");
      injected.async = true;
      injected.src = `https://embed.tawk.to/${data.embedId}`;
      injected.charset = "UTF-8";
      injected.setAttribute("crossorigin", "*");
      document.body.appendChild(injected);
    } else if (data.provider === "crisp") {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = data.embedId;
      injected = document.createElement("script");
      injected.async = true;
      injected.src = "https://client.crisp.chat/l.js";
      document.head.appendChild(injected);
    }

    return () => {
      if (injected?.parentNode) injected.parentNode.removeChild(injected);
    };
  }, [data?.provider, data?.embedId]);

  return null;
}
