import { PortfolioCategoriesScreen } from "@/modules/portfolioCategories/screen";

export async function resolveDashboardScreen(slug) {
  switch (slug) {
    case "portfolio-categories":
      return <PortfolioCategoriesScreen />;

    default:
      return null;
  }
}