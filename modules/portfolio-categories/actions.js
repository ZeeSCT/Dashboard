"use server";

import { revalidatePath } from "next/cache";
import {
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
} from "./api";

export async function createCategoryAction(formData) {
  await createPortfolioCategory({
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
    displayOrder: Number(formData.get("displayOrder") || 0),
    isActive: formData.get("isActive") === "on",
  });

  revalidatePath("/dashboard/portfolio-categories");
}

export async function updateCategoryAction(id, payload) {
  await updatePortfolioCategory(id, payload);
  revalidatePath("/dashboard/portfolio-categories");
}

export async function deleteCategoryAction(id) {
  await deletePortfolioCategory(id);
  revalidatePath("/dashboard/portfolio-categories");
}