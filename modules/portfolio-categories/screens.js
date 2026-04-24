import ScreenRenderer from "@/modules/dashboard/components/ScreenRenderer";
import { getPortfolioCategories } from "./api";
import { mapPortfolioCategoriesToScreen } from "./mapper";
import CategoryForm from "./components/CategoryForm";

export async function PortfolioCategoriesScreen() {
  const data = await getPortfolioCategories();

  const screen = mapPortfolioCategoriesToScreen(data);

  return (
    <div className="space-y-6">
      <CategoryForm />
      <ScreenRenderer screen={screen} />
    </div>
  );
}