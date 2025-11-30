import { getInitialData } from "@/services/mockDataService";
import { BucketItem, TimeBucket, UserProfile } from "@/types";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "false" ? false : true;

// API_BASE_URL is the API prefix (default /api/v1). BACKEND_BASE_URL is the origin for auth redirects.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const fetchJson = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    credentials: "include", // send session cookies for auth
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    // 明示的に401を区別
    if (res.status === 401) {
      throw new ApiError(401, "Unauthorized");
    }
    throw new ApiError(res.status, `API request failed: ${res.statusText}`);
  }

  if (res.status === 204) return null;

  return res.json();
};

const mapBucketItem = (apiItem: any): BucketItem => ({
  id: apiItem.id,
  timeBucketId: apiItem.time_bucket_id,
  title: apiItem.title,
  category: apiItem.category,
  difficulty: apiItem.difficulty,
  riskLevel: apiItem.risk_level,
  costEstimate: apiItem.estimated_cost,
  status: apiItem.status,
  targetYear: apiItem.target_year,
  valueStatement: apiItem.value_statement,
  description: apiItem.value_statement || "",
  completedAt: apiItem.completed_at,
  createdAt: apiItem.created_at,
  updatedAt: apiItem.updated_at,
});

const mapTimeBucket = (apiBucket: any): TimeBucket => ({
  id: apiBucket.id,
  label: `${apiBucket.start_age}-${apiBucket.end_age}`,
  startAge: apiBucket.start_age,
  endAge: apiBucket.end_age,
  description: apiBucket.description,
  position: apiBucket.position,
  items: [],
});

const mapUserProfile = (apiUser: any): UserProfile => ({
  id: apiUser.id,
  email: apiUser.email,
  birthdate: apiUser.birthdate,
  currentAge: apiUser.current_age,
  timezone: apiUser.timezone,
});

const patchProfile = async (body: Partial<UserProfile>): Promise<UserProfile> => {
  const data = await fetchJson(`${API_BASE_URL}/profile`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return mapUserProfile(data);
};

const RealApiClient = {
  get: async <T>(path: string): Promise<T> => {
    if (path === "/user") {
      const data = await fetchJson(`${API_BASE_URL}/profile`);
      return mapUserProfile(data) as T;
    }

    if (path === "/buckets") {
      const bucketsData = await fetchJson(`${API_BASE_URL}/time_buckets`);
      const buckets = bucketsData.map(mapTimeBucket);

      const bucketsWithItems = await Promise.all(
        buckets.map(async (bucket: TimeBucket) => {
          try {
            const itemsData = await fetchJson(
              `${API_BASE_URL}/time_buckets/${bucket.id}/bucket_items`
            );
            return { ...bucket, items: itemsData.map(mapBucketItem) };
          } catch (e) {
            console.error(`Failed to fetch items for bucket ${bucket.id}`, e);
            return bucket;
          }
        })
      );

      return bucketsWithItems as T;
    }

    throw new ApiError(404, `Path ${path} not handled in Real Client`);
  },

  patch: async <T>(path: string, body: any): Promise<T> => {
    const match = path.match(/\/buckets\/(.+)\/items\/(.+)/);
    if (match) {
      const bucketId = match[1];
      const itemId = match[2];

      const apiBody: any = {};
      if (body.status) apiBody.status = body.status;
      if (body.title) apiBody.title = body.title;

      const data = await fetchJson(
        `${API_BASE_URL}/time_buckets/${bucketId}/bucket_items/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify(apiBody),
        }
      );
      return mapBucketItem(data) as T;
    }

    throw new ApiError(400, "Invalid patch path. Expected /buckets/:bucketId/items/:itemId");
  },
  patchProfile,
};

let mockDb = getInitialData();
const DELAY = 600;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MockApiClient = {
  get: async <T>(path: string): Promise<T> => {
    await delay(DELAY);
    if (path === "/user") return mockDb.user as T;
    if (path === "/buckets") return mockDb.buckets as T;
    throw new ApiError(404, `Path ${path} not found`);
  },

  patch: async <T>(path: string, body: any): Promise<T> => {
    await delay(DELAY / 2);
    const itemId = path.split("/").pop();

    let updatedItem: BucketItem | undefined;
    mockDb.buckets = mockDb.buckets.map((b) => ({
      ...b,
      items: b.items.map((i) => {
        if (i.id === itemId) {
          updatedItem = { ...i, ...body };
          return updatedItem;
        }
        return i;
      }),
    }));

    if (updatedItem) return updatedItem as T;
    throw new ApiError(404, "Item not found in Mock DB");
  },
  patchProfile,
};

export const apiClient = USE_MOCK ? MockApiClient : RealApiClient;
