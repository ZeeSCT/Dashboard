/* ================================== */
/* IMPORTS */
/* ================================== */

import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "./auth";

/* ================================== */
/* CONFIG */
/* ================================== */

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

/* ================================== */
/* DATABASE-DRIVEN STRING TYPES */
/* ================================== */

export type PortfolioCategoryCode = string;

export type ProjectHealthLabel = string;
export type ProjectHealthStatus = string;
export type ProjectHealthSeverity = string | null;

export type ApprovalBottleneckApproverType = string;
export type ApprovalBottleneckStatus = string;
export type ApprovalBottleneckSeverity = string | null;

export type DocumentationStage = string;
export type DocumentationStatusLabel = string;
export type DocumentationStatusCode = string;
export type DocumentationStatusSeverity = string | null;

export type ProjectActivitySeverity = string;
export type ProjectMilestoneStatus = string;
export type ProjectMilestoneSeverity = string | null;

/* ================================== */
/* LOOKUP TYPES */
/* ================================== */

export interface LookupOption {
  id: string;
  code: string;
  label: string;
  severity?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface PortfolioCategory {
  id: string | number;
  code: string;
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecutiveLookupsResponse {
  portfolioCategories: PortfolioCategory[];
  documentationStages: LookupOption[];
  documentApprovalStatuses: LookupOption[];
  projectHealthStatuses: LookupOption[];
  milestoneStatuses: LookupOption[];
  activitySeverities: LookupOption[];
}

/* ================================== */
/* PORTFOLIO CATEGORY TYPES */
/* ================================== */

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

/* ================================== */
/* PORTFOLIO OVERVIEW TYPES */
/* ================================== */

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
  healthSeverity?: ProjectHealthSeverity;
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
  healthSeverity?: ProjectHealthSeverity;
  delayedApprovals: number;
  blocked: number;
  contractValue?: number;
  billingReadyAmount: number | null;
  billingReady: number | null;
  topIssue?: string | null;
}

export interface PortfolioOverviewResponse {
  selectedCategory: PortfolioCategoryCode;
  selectedCategoryLabel?: string;
  kpis: PortfolioOverviewKpis;
  healthStatus: PortfolioOverviewHealthStatus;
  topIssues: PortfolioTopIssue[];
  projects: PortfolioOverviewProject[];
}

/* ================================== */
/* APPROVAL BOTTLENECKS TYPES */
/* ================================== */

export interface ApprovalBottleneckKpis {
  totalPending: number;
  overdueCount: number;
  averageApprovalTimeDays: number;
  approvedThisMonth: number;
  approvedThisMonthChangePct: number;
}

export interface ApprovalBottleneckItem {
  approverType: ApprovalBottleneckApproverType;
  approverTypeCode: string;
  pendingCount: number;
  widthPercent: number;
}

export interface ApprovalBottleneckOverdueItem {
  id: string;
  project: string;
  document: string;
  approverType: ApprovalBottleneckApproverType;
  approverTypeCode: string;
  daysOverdue: number;
}

export interface ApprovalBottleneckPendingApproval {
  id: string;
  document: string;
  project: string;
  projectCode: string;
  approver: string;
  approverType: ApprovalBottleneckApproverType;
  approverTypeCode: string;
  submitted: string;
  submittedAt: string;
  daysPending: number;
  status: ApprovalBottleneckStatus;
  statusCode: string;
  statusSeverity: ApprovalBottleneckSeverity;
}

export interface ApprovalBottlenecksResponse {
  selectedCategory: PortfolioCategoryCode;
  selectedCategoryLabel: string;
  kpis: ApprovalBottleneckKpis;
  bottlenecks: ApprovalBottleneckItem[];
  mostOverdue: ApprovalBottleneckOverdueItem[];
  pendingApprovals: ApprovalBottleneckPendingApproval[];
}

/* ================================== */
/* DOCUMENTATION STATUS TYPES */
/* ================================== */

export interface DocumentationStatusKpis {
  totalDocuments: number;

  approved?: number;
  underReview?: number;
  overdue?: number;
  inPreparation?: number;
  rejected?: number;
  atRisk?: number;

  [key: string]: number | undefined;
}

export interface DocumentationStatusSummaryItem {
  code?: DocumentationStatusCode;
  label: DocumentationStatusLabel;
  value: number;
  percent: number;
  severity?: DocumentationStatusSeverity;
}

export interface DocumentationOverdueApproval {
  id: string;
  project: string;
  document: string;
  title: string;
  approver: string;
  status: DocumentationStatusLabel;
  statusCode?: DocumentationStatusCode;
  days: number;
  severity: DocumentationStatusSeverity;
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
  statusCode?: DocumentationStatusCode;
  statusSeverity?: DocumentationStatusSeverity;
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

export interface ProjectDrillDownProjectOption {
  id: string;
  code: string;
  name: string;
  clientName?: string | null;
  projectManager?: string | null;
  health: ProjectHealthLabel;
  healthStatus: ProjectHealthStatus;
  healthSeverity?: ProjectHealthSeverity;
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
  statusSeverity?: ProjectHealthSeverity;
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
  statusCode?: string;
  statusSeverity?: ProjectMilestoneSeverity;
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
  healthSeverity?: ProjectHealthSeverity;
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
/* REVENUE & BILLING TYPES */
/* ================================== */

export interface RevenueBillingSummary {
  contractValue: number;
  invoicedToDate: number;
  billingReadyNow: number;
  overdueReceivables: number;
  totalProjects: number;
  billingReadyProjects: number;
  invoicedPct: number;
}

export interface RevenueBillingProject {
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  contractValue: number;
  invoicedToDate: number;
  progressPct: number;
  billingReadyAmount: number;
  status: string;
  tone: string;
}

/* ================================== */
/* PROJECT HEALTH TYPES */
/* ================================== */

export interface ProjectHealthSummaryItem {
  status: ProjectHealthStatus;
  label: string;
  severity?: ProjectHealthSeverity;
  value: number;
  percentage: number;
}

export interface DelayedMilestoneItem {
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  pendingMilestones: number;
  status: ProjectHealthStatus;
  severity?: ProjectHealthSeverity;
  label: string;
  widthPct: number;
}

export interface BlockedItem {
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  blockedItems: number;
  label: string;
  widthPct: number;
}

export interface HealthTrendItem {
  week: string;
  onTrack: number;
  atRisk: number;
  delayed: number;
  critical: number;
}

export type ProjectHealthSummaryResponse = ProjectHealthSummaryItem[];
export type BlockedItemsResponse = BlockedItem[];
export type DelayedMilestonesResponse = DelayedMilestoneItem[];
export type HealthTrendResponse = HealthTrendItem[];

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
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const err = data as {
      message?: string | string[];
      error?: string;
    };

    const message = Array.isArray(err?.message)
      ? err.message.join(", ")
      : err?.message || err?.error || "API request failed";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

/* ================================== */
/* RESPONSE NORMALIZER */
/* ================================== */

export function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res;

  if (Array.isArray((res as { data?: unknown })?.data)) {
    return (res as { data: T[] }).data;
  }

  if (Array.isArray((res as { items?: unknown })?.items)) {
    return (res as { items: T[] }).items;
  }

  if (Array.isArray((res as { result?: unknown })?.result)) {
    return (res as { result: T[] }).result;
  }

  return [];
}

/* ================================== */
/* EXECUTIVE LOOKUPS API */
/* ================================== */

export const executiveLookupsApi = {
  getLookups: () => {
    return request<ExecutiveLookupsResponse>("/executive/lookups");
  },
};

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
      `/executive/portfolio-categories?${query.toString()}`,
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
    const query = new URLSearchParams({ category });

    return request<PortfolioOverviewResponse>(
      `/executive/portfolio-overview?${query.toString()}`,
    );
  },
};

/* ================================== */
/* PROJECT HEALTH API */
/* ================================== */

export const projectHealthApi = {
  getSummary: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<ProjectHealthSummaryResponse>(
      `/executive/project-health/summary?${query.toString()}`,
    );
  },

  getBlockedItems: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<BlockedItemsResponse>(
      `/executive/project-health/blocked-items?${query.toString()}`,
    );
  },

  getDelayedMilestones: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<DelayedMilestonesResponse>(
      `/executive/project-health/delayed-milestones?${query.toString()}`,
    );
  },

  getHealthTrend: () => {
    return request<HealthTrendResponse>(
      "/executive/project-health/health-trend",
    );
  },
};

/* ================================== */
/* DOCUMENTATION STATUS API */
/* ================================== */

export const documentationStatusApi = {
  getStatus: (
    category: PortfolioCategoryCode = "all",
    stage: DocumentationStage = "pre-construction",
  ) => {
    const query = new URLSearchParams({
      category,
      stage,
    });

    return request<DocumentationStatusResponse>(
      `/executive/documentation-status?${query.toString()}`,
    );
  },
};

/* ================================== */
/* PROJECT DRILL DOWN API */
/* ================================== */

export const projectDrillDownApi = {
  getSummary: (
    category: PortfolioCategoryCode = "all",
    projectId?: string | null,
  ) => {
    const query = new URLSearchParams({
      category,
      ...(projectId ? { projectId } : {}),
    });

    return request<ProjectDrillDownResponse>(
      `/executive/project-drilldown?${query.toString()}`,
    );
  },
};

/* ================================== */
/* REVENUE & BILLING API */
/* ================================== */

export const revenueBillingApi = {
  getSummary: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<RevenueBillingSummary>(
      `/executive/revenue-billing/summary?${query.toString()}`,
    );
  },

  getProjects: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<RevenueBillingProject[]>(
      `/executive/revenue-billing/by-project?${query.toString()}`,
    );
  },
};

/* ================================== */
/* APPROVAL BOTTLENECKS API */
/* ================================== */

export const approvalBottlenecksApi = {
  getOverview: (category: PortfolioCategoryCode = "all") => {
    const query = new URLSearchParams({ category });

    return request<ApprovalBottlenecksResponse>(
      `/executive/approval-bottlenecks?${query.toString()}`,
    );
  },
};

/* ================================== */
/* REACT QUERY KEYS */
/* ================================== */

export const executiveLookupKeys = {
  all: ["executive-lookups"] as const,
};

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

  detail: (category: PortfolioCategoryCode, stage: DocumentationStage) =>
    [...documentationStatusKeys.all, category, stage] as const,
};

export const projectDrillDownKeys = {
  all: ["project-drill-down"] as const,

  detail: (category: PortfolioCategoryCode, projectId?: string | null) =>
    [...projectDrillDownKeys.all, category, projectId ?? "default"] as const,
};

export const revenueBillingKeys = {
  all: ["revenue-billing"] as const,

  summary: (category: PortfolioCategoryCode) =>
    [...revenueBillingKeys.all, "summary", category] as const,

  projects: (category: PortfolioCategoryCode) =>
    [...revenueBillingKeys.all, "projects", category] as const,
};

export const projectHealthKeys = {
  all: ["project-health"] as const,

  summary: (category: PortfolioCategoryCode) =>
    [...projectHealthKeys.all, "summary", category] as const,

  blockedItems: (category: PortfolioCategoryCode) =>
    [...projectHealthKeys.all, "blocked-items", category] as const,

  delayedMilestones: (category: PortfolioCategoryCode) =>
    [...projectHealthKeys.all, "delayed-milestones", category] as const,

  healthTrend: () => [...projectHealthKeys.all, "health-trend"] as const,
};

export const approvalBottlenecksKeys = {
  all: ["approval-bottlenecks"] as const,

  detail: (category: PortfolioCategoryCode) =>
    [...approvalBottlenecksKeys.all, category] as const,
};

/* ================================== */
/* REACT QUERY HOOKS - EXECUTIVE LOOKUPS */
/* ================================== */

export function useExecutiveLookups() {
  return useQuery({
    queryKey: executiveLookupKeys.all,
    queryFn: () => executiveLookupsApi.getLookups(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - PORTFOLIO OVERVIEW */
/* ================================== */

export function usePortfolioOverview(
  category: PortfolioCategoryCode = "all",
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
  stage: DocumentationStage = "pre-construction",
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
  projectId?: string | null,
) {
  return useQuery({
    queryKey: projectDrillDownKeys.detail(category, projectId),
    queryFn: () => projectDrillDownApi.getSummary(category, projectId),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - REVENUE & BILLING */
/* ================================== */

export function useRevenueBillingSummary(
  category: PortfolioCategoryCode = "all",
) {
  return useQuery({
    queryKey: revenueBillingKeys.summary(category),
    queryFn: () => revenueBillingApi.getSummary(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useRevenueBillingProjects(
  category: PortfolioCategoryCode = "all",
) {
  return useQuery({
    queryKey: revenueBillingKeys.projects(category),
    queryFn: () => revenueBillingApi.getProjects(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - PROJECT HEALTH */
/* ================================== */

export function useProjectHealthSummary(
  category: PortfolioCategoryCode = "all",
) {
  return useQuery({
    queryKey: projectHealthKeys.summary(category),
    queryFn: () => projectHealthApi.getSummary(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useBlockedItems(category: PortfolioCategoryCode = "all") {
  return useQuery({
    queryKey: projectHealthKeys.blockedItems(category),
    queryFn: () => projectHealthApi.getBlockedItems(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useDelayedMilestones(
  category: PortfolioCategoryCode = "all",
) {
  return useQuery({
    queryKey: projectHealthKeys.delayedMilestones(category),
    queryFn: () => projectHealthApi.getDelayedMilestones(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useHealthTrend() {
  return useQuery({
    queryKey: projectHealthKeys.healthTrend(),
    queryFn: () => projectHealthApi.getHealthTrend(),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

/* ================================== */
/* REACT QUERY HOOKS - APPROVAL BOTTLENECKS */
/* ================================== */

export function useApprovalBottlenecks(
  category: PortfolioCategoryCode = "all",
) {
  return useQuery({
    queryKey: approvalBottlenecksKeys.detail(category),
    queryFn: () => approvalBottlenecksApi.getOverview(category),
    staleTime: 60 * 1000,
    retry: 1,
  });
}