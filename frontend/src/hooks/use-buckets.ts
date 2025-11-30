import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { BucketItem, TimeBucket, UserProfile } from "@/types";

const fetcher = (url: string) => apiClient.get(url);

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>("/user", fetcher, {
    shouldRetryOnError: (err) => err?.status !== 401,
  });

  const updateUser = async (updates: Partial<UserProfile>) => {
    const optimistic = data ? { ...data, ...updates } : undefined;
    if (optimistic) mutate(optimistic, false);
    try {
      const updated = await apiClient.patchProfile(updates);
      mutate(updated, false);
      return updated;
    } catch (e) {
      if (optimistic) mutate(optimistic, false);
      throw e;
    }
  };
  return {
    user: data,
    isLoading,
    isError: error,
    updateUser,
  };
}

export function useBuckets() {
  const { data, error, isLoading, mutate } = useSWR<TimeBucket[]>("/buckets", fetcher, {
    shouldRetryOnError: (err) => err?.status !== 401,
  });

  const updateItem = async (bucketId: string, itemId: string, updates: Partial<BucketItem>) => {
    if (!data) return;

    const originalBuckets = [...data];
    const newBuckets = data.map((b) => {
      if (b.id === bucketId) {
        return {
          ...b,
          items: b.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
        };
      }
      return b;
    });

    mutate(newBuckets, false);

    try {
      await apiClient.patch(`/buckets/${bucketId}/items/${itemId}`, updates);
      mutate();
    } catch (e) {
      console.error("Update failed", e);
      mutate(originalBuckets, false);
    }
  };

  return {
    buckets: data || [],
    isLoading,
    isError: error,
    updateItem,
  };
}
