import PortfolioOverview from "@/components/screens/executive/PortfolioOverview";
import ProjectHealth from "@/components/screens/executive/ProjectHealth";
import RevenueBilling from "@/components/screens/executive/RevenueBilling";
import ApprovalBottlenecks from "@/components/screens/executive/ApprovalBottlenecks";
import DocumentationStatus from "@/components/screens/executive/DocumentationStatus";
import ProjectDrillDown from "@/components/screens/executive/ProjectDrillDown";
import TenderPipeline from "@/components/screens/tender/TenderPipeline";
import EnquiryRegister from "@/components/screens/tender/EnquiryRegister";
import BidAnalysis from "@/components/screens/tender/BidAnalysis";
import CostingPricing from "@/components/screens/tender/CostingPricing";
import RiskAssessment from "@/components/screens/tender/RiskAssessment";
import TenderApprovals from "@/components/screens/tender/TenderApprovals";
import SubmissionTracker from "@/components/screens/tender/SubmissionTracker";
import WonLostRegister from "@/components/screens/tender/WonLostRegister";
import ProjectWorkspace from "@/components/screens/project/ProjectWorkspace";
import MilestoneTracker from "@/components/screens/project/MilestoneTracker";
import WorkPackageTracker from "@/components/screens/project/WorkPackageTracker";
import SiteProgressView from "@/components/screens/project/SiteProgressView";
import TaskAssignmentBoard from "@/components/screens/project/TaskAssignmentBoard";
import RiskIssueBlocker from "@/components/screens/project/RiskIssueBlocker";
import DocumentReadiness from "@/components/screens/project/DocumentReadiness";
import ApprovalFollowUp from "@/components/screens/project/ApprovalFollowUp";
import InspectionFollowUp from "@/components/screens/project/InspectionFollowUp";
import MaterialResource from "@/components/screens/project/MaterialResource";
import CommercialProgress from "@/components/screens/project/CommercialProgress";
import PlanningOverview from "@/components/screens/project/PlanningOverview";
import WbsTimeline from "@/components/screens/project/WbsTimeline";
import MilestoneRegister from "@/components/screens/project/MilestoneRegister";
import ActivityRegister from "@/components/screens/project/ActivityRegister";
import CriticalFloatView from "@/components/screens/project/CriticalFloatView";
import ResourcePlan from "@/components/screens/project/ResourcePlan";
import MonthlyLookahead from "@/components/screens/project/MonthlyLookahead";
import InspectionRegister from "@/components/screens/qa/InspectionRegister";
import NcrLog from "@/components/screens/qa/NcrLog";
import PunchList from "@/components/screens/qa/PunchList";
import MaterialRequests from "@/components/screens/procurement/MaterialRequests";
import RfqTracker from "@/components/screens/procurement/RfqTracker";
import PoRegister from "@/components/screens/procurement/PoRegister";
import MaintenanceDashboard from "@/components/screens/maintenance/MaintenanceDashboard";
import PreventiveTasks from "@/components/screens/maintenance/PreventiveTasks";
import CorrectiveTasks from "@/components/screens/maintenance/CorrectiveTasks";
import type { ScreenKey } from "@/data/screens";
export const pageRegistry: Record<ScreenKey, React.ComponentType> = {
  portfolio: PortfolioOverview,
  health: ProjectHealth,
  billing: RevenueBilling,
  approvals: ApprovalBottlenecks,
  docstatus: DocumentationStatus,
  drilldown: ProjectDrillDown,
  "tender-pipeline": TenderPipeline,
  "tender-enquiry": EnquiryRegister,
  "tender-bid": BidAnalysis,
  "tender-costing": CostingPricing,
  "tender-risk": RiskAssessment,
  "tender-approval": TenderApprovals,
  "tender-submit": SubmissionTracker,
  "tender-wonlost": WonLostRegister,
  workspace: ProjectWorkspace,
  milestones: MilestoneTracker,
  packages: WorkPackageTracker,
  siteprog: SiteProgressView,
  taskboard: TaskAssignmentBoard,
  risks: RiskIssueBlocker,
  docready: DocumentReadiness,
  appfollow: ApprovalFollowUp,
  inspfollow: InspectionFollowUp,
  material: MaterialResource,
  commercial: CommercialProgress,
  "plan-overview": PlanningOverview,
  "plan-wbs": WbsTimeline,
  "plan-milestones": MilestoneRegister,
  "plan-activities": ActivityRegister,
  "plan-critical": CriticalFloatView,
  "plan-resources": ResourcePlan,
  "plan-lookahead": MonthlyLookahead,
  qainspections: InspectionRegister,
  qancr: NcrLog,
  qapunchlist: PunchList,
  "proc-mr": MaterialRequests,
  "proc-rfq": RfqTracker,
  "proc-po": PoRegister,
  "maint-dash": MaintenanceDashboard,
  "maint-pm": PreventiveTasks,
  "maint-cm": CorrectiveTasks,
};
