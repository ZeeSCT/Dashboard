/* ================================== */
/* IMPORTS */
/* ================================== */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/* ================================== */
/* CONFIG */
/* ================================== */

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

/* ================================== */
/* TYPES */
/* ================================== */

export type PortfolioCategoryCode =
  | "all"
  | "its"
  | "traffic"
  | "its-maint"
  | "traffic-maint";

export type ProjectHealthLabel =
  | "On track"
  | "At risk"
  | "Delayed"
  | "Critical";

export type ProjectHealthStatus =
  | "ON_TRACK"
  | "AT_RISK"
  | "DELAYED"
  | "CRITICAL";

export interface PortfolioCategory {
  id: string | number;
  code: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioCategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  items?: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PortfolioOverviewKpis {
  activeProjects: number;
  portfolioCompletion: number;
  delayedMilestones: number;
  pendingApprovals: number;
  blockedItems: number;
  billingReadyAmount: number;
  billingReadyProjects: number;
}

export interface PortfolioOverviewHealthStatus {
  total: number;
  counts: {
    onTrack: number;
    atRisk: number;
    delayed: number;
    critical: number;
  };
}

export interface PortfolioTopIssue {
  id: string;
  projectName: string;
  projectCode?: string;
  categoryCode: string;
  categoryName: string;
  health: ProjectHealthLabel;
  healthStatus: ProjectHealthStatus;
  issueTitle: string | null;
  issueAgeDays?: number | null;
}

export interface PortfolioOverviewProject {
  id: string;
  code: string;
  project: string;
  clientName?: string;
  categoryCode: string;
  categoryName: string;
  pm: string;
  pmEmail?: string | null;
  completion: number;
  plannedProgress?: number;
  actualProgress?: number;
  health: ProjectHealthLabel;
  healthStatus: ProjectHealthStatus;
  delayedApprovals: number;
  blocked: number;
  contractValue?: number;
  billingReadyAmount: number | null;
  billingReady: number | null;
  topIssue?: string | null;
}

export interface PortfolioOverviewResponse {
  selectedCategory: PortfolioCategoryCode;
  kpis: PortfolioOverviewKpis;
  healthStatus: PortfolioOverviewHealthStatus;
  topIssues: PortfolioTopIssue[];
  projects: PortfolioOverviewProject[];
}

/* ================================== */
/* ERROR CLASS */
/* ================================== */

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

/* ================================== */
/* CORE REQUEST LAYER */
/* ================================== */

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data: unknown;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!response.ok) {
    const err = data as any;

    throw new ApiError(
      err?.message || err?.error || "API request failed",
      response.status,
      data
    );
  }

  return data as T;
}

/* ================================== */
/* RESPONSE NORMALIZER */
/* ================================== */

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any)?.data)) return (res as any).data;
  if (Array.isArray((res as any)?.items)) return (res as any).items;
  if (Array.isArray((res as any)?.result)) return (res as any).result;

  return [];
}

/* ================================== */
/* PORTFOLIO CATEGORY API */
/* ================================== */

export const portfolioApi = {
  getAll: (filters: PortfolioCategoryFilters = {}) => {
    const query = new URLSearchParams({
      page: String(filters.page ?? 1),
      limit: String(filters.limit ?? 100),
      ...(filters.search ? { search: filters.search } : {}),
    });

    return request<PaginatedResponse<PortfolioCategory>>(
      `/portfolio-categories?${query.toString()}`
    );
  },

  getOne: (id: string | number) =>
    request<PortfolioCategory>(`/portfolio-categories/${id}`),

  create: (payload: Partial<PortfolioCategory>) =>
    request<PortfolioCategory>("/portfolio-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string | number, payload: Partial<PortfolioCategory>) =>
    request<PortfolioCategory>(`/portfolio-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string | number) =>
    request<PortfolioCategory>(`/portfolio-categories/${id}`, {
      method: "DELETE",
    }),
};

/* ================================== */
/* PORTFOLIO OVERVIEW API */
/* ================================== */

export const portfolioOverviewApi = {
  getOverview: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({
      category,
    });

    return request<PortfolioOverviewResponse>(
      `/portfolio-overview?${query.toString()}`
    );
  },
};

/* ================================== */
/* REACT QUERY KEYS */
/* ================================== */

export const portfolioKeys = {
  all: ["portfolio"] as const,

  categories: () => [...portfolioKeys.all, "categories"] as const,

  list: (filters: PortfolioCategoryFilters) =>
    [...portfolioKeys.categories(), filters] as const,

  detail: (id: string | number) =>
    [...portfolioKeys.categories(), id] as const,

  overview: (category: PortfolioCategoryCode) =>
    [...portfolioKeys.all, "overview", category] as const,
};

/* ================================== */
/* REACT QUERY HOOKS - CATEGORIES */
/* ================================== */

export function usePortfolioCategories(
  filters: PortfolioCategoryFilters = {}
) {
  return useQuery({
    queryKey: portfolioKeys.list(filters),
    queryFn: async () => {
      const res = await portfolioApi.getAll(filters);

      return {
        data: normalizeList<PortfolioCategory>(res),
        meta: res.meta,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/* Optional alias if older files use this name */
export const getPortfolioCategories = usePortfolioCategories;

export function useCreatePortfolioCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: portfolioApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.categories() });
    },
    retry: 1,
  });
}

export function useUpdatePortfolioCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: Partial<PortfolioCategory>;
    }) => portfolioApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.categories() });
    },
    retry: 1,
  });
}

export function useDeletePortfolioCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: portfolioApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: portfolioKeys.categories() });
    },
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - OVERVIEW */
/* ================================== */

export function usePortfolioOverview(
  category: PortfolioCategoryCode = "all"
) {
  return useQuery({
    queryKey: portfolioKeys.overview(category),
    queryFn: () => portfolioOverviewApi.getOverview(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}