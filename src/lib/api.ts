/* ================================== */
/* IMPORTS */
/* ================================== */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";

/* ================================== */
/* CONFIG */
/* ================================== */

export const API_BASE_URL: string =process.env.NEXT_PUBLIC_API_BASE_URL;

/* ================================== */
/* TYPES */
/* ================================== */

/* ================================== */
/* Portfolio STATUS TYPES */
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
/* DOCUMENTATION STATUS TYPES */
/* ================================== */

export type DocumentationStage =
  | "pre-construction"
  | "design"
  | "procurement"
  | "construction"
  | "testing-commissioning"
  | "closeout";

export type DocumentationStatusLabel =
  | "Approved"
  | "Under review"
  | "In preparation"
  | "Overdue"
  | "Rejected"
  | "At risk";

export interface DocumentationStatusKpis {
  totalDocuments: number;
  approved: number;
  underReview: number;
  overdue: number;
  inPreparation: number;
  rejected: number;
  atRisk: number;
}

export interface DocumentationStatusSummaryItem {
  label: DocumentationStatusLabel;
  value: number;
  percent: number;
}

export interface DocumentationOverdueApproval {
  id: string;
  project: string;
  document: string;
  title: string;
  approver: string;
  status: DocumentationStatusLabel;
  days: number;
  severity: "danger" | "warning";
}

export interface DocumentationRegisterItem {
  id: string;
  categoryCode: PortfolioCategoryCode;
  categoryName: string;
  document: string;
  project: string;
  revision: string;
  submitted: string;
  approver: string;
  status: DocumentationStatusLabel;
  count: number;
  overdueDays: number | null;
}

export interface DocumentationStatusResponse {
  selectedCategory: PortfolioCategoryCode;
  selectedCategoryLabel: string;
  selectedStage: DocumentationStage;
  selectedStageLabel: string;
  kpis: DocumentationStatusKpis;
  statusSummary: DocumentationStatusSummaryItem[];
  overdueApprovals: DocumentationOverdueApproval[];
  register: DocumentationRegisterItem[];
}

/* ================================== */
/* PROJECT DRILL DOWN TYPES */
/* ================================== */

export type ProjectActivitySeverity = "success" | "warning" | "danger";

export type ProjectMilestoneStatus =
  | "Complete"
  | "Delayed"
  | "At risk"
  | "Upcoming";

export interface ProjectDrillDownProjectOption {
  id: string;
  code: string;
  name: string;
  clientName?: string | null;
  projectManager?: string | null;
  health: ProjectHealthLabel;
  healthStatus: ProjectHealthStatus;
}

export interface ProjectDrillDownKpis {
  completion: number;
  plannedProgress: number;
  scheduleVariance: number;
  blockedPackages: number;
  totalPackages: number;
  pendingApprovals: number;
  overdueApprovals: number;
  openNcrs: number;
}

export interface ProjectDrillDownPackage {
  id: string;
  name: string;
  status: ProjectHealthStatus;
  completion: number;
}

export interface ProjectDrillDownActivity {
  id: string;
  title: string;
  description: string;
  severity: ProjectActivitySeverity;
}

export interface ProjectDrillDownMilestone {
  id: string;
  name: string;
  plannedDate: string;
  forecastDate: string | null;
  varianceDays: number | null;
  status: ProjectMilestoneStatus;
}

export interface ProjectDrillDownSummary {
  id: string;
  code: string;
  name: string;
  clientName?: string | null;
  projectManager?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  health: ProjectHealthLabel;
  healthStatus: ProjectHealthStatus;
  kpis: ProjectDrillDownKpis;
  packages: ProjectDrillDownPackage[];
  activities: ProjectDrillDownActivity[];
  milestones: ProjectDrillDownMilestone[];
}

export interface ProjectDrillDownResponse {
  selectedCategory: PortfolioCategoryCode;
  selectedProjectId: string | null;
  projects: ProjectDrillDownProjectOption[];
  project: ProjectDrillDownSummary | null;
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
      ...getAuthHeaders(),
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
      `/executive/portfolio-categories?${query.toString()}`
    );
  },

  getOne: (id: string | number) =>
    request<PortfolioCategory>(`/executive/portfolio-categories/${id}`),


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
      `/executive/portfolio-overview?${query.toString()}`
    );
  },
};

/* ================================== */
/* DOCUMENTATION STATUS API */
/* ================================== */

export const documentationStatusApi = {
  getStatus: (
    category: PortfolioCategoryCode = "all",
    stage: DocumentationStage = "pre-construction"
  ) => {
    const query = new URLSearchParams({
      category,
      stage,
    });

    return request<DocumentationStatusResponse>(
      `/executive/documentation-status?${query.toString()}`
    );
  },
};


/* ================================== */
/* PROJECT DRILL DOWN API */
/* ================================== */

export const projectDrillDownApi = {
  getSummary: (
    category: PortfolioCategoryCode = "all",
    projectId?: string | null
  ) => {
    const query = new URLSearchParams({
      category,
      ...(projectId ? { projectId } : {}),
    });

    return request<ProjectDrillDownResponse>(
      `/executive/project-drilldown?${query.toString()}`
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

export const documentationStatusKeys = {
  all: ["documentation-status"] as const,

  detail: (
    category: PortfolioCategoryCode,
    stage: DocumentationStage
  ) => [...documentationStatusKeys.all, category, stage] as const,
};

export const projectDrillDownKeys = {
  all: ["project-drill-down"] as const,

  detail: (
    category: PortfolioCategoryCode,
    projectId?: string | null
  ) => [...projectDrillDownKeys.all, category, projectId ?? "default"] as const,
};

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

/* ================================== */
/* REACT QUERY HOOKS - DOCUMENTATION STATUS */
/* ================================== */

export function useDocumentationStatus(
  category: PortfolioCategoryCode = "all",
  stage: DocumentationStage = "pre-construction"
) {
  return useQuery({
    queryKey: documentationStatusKeys.detail(category, stage),
    queryFn: () => documentationStatusApi.getStatus(category, stage),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - PROJECT DRILL DOWN */
/* ================================== */

export function useProjectDrillDown(
  category: PortfolioCategoryCode = "all",
  projectId?: string | null
) {
  return useQuery({
    queryKey: projectDrillDownKeys.detail(category, projectId),
    queryFn: () => projectDrillDownApi.getSummary(category, projectId),
    staleTime: 60 * 1000,
    retry: 1,
  });
}