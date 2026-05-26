import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to Postgres changes on a table and invalidate a TanStack Query key
 * whenever data mutates. Lets the admin panel reflect on the homepage instantly.
 */
export function useRealtimeInvalidate(table: string, queryKey: readonly unknown[]) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`rt:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => qc.invalidateQueries({ queryKey: queryKey as unknown[] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, qc, JSON.stringify(queryKey)]);
}
