export type PortfolioCategory =
  | "all"
  | "its"
  | "traffic"
  | "its-maint"
  | "traffic-maint";

export const portfolioCategoryOptions: {
  label: string;
  value: PortfolioCategory;
}[] = [
  { label: "All portfolios", value: "all" },
  { label: "ITS Projects", value: "its" },
  { label: "Traffic Projects", value: "traffic" },
  { label: "ITS Maintenance", value: "its-maint" },
  { label: "Traffic Maintenance", value: "traffic-maint" },
];