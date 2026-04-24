export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

async function parseResponse(response) {
  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Unexpected response" };
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || data?.error || "Request failed";

    throw new Error(message);
  }

  return data;
}

/* =========================
   PORTFOLIO CATEGORIES CRUD
========================= */

/* GET ALL */
export async function getPortfolioCategories({
  page = 1,
  limit = 20,
  search = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  const r = await fetch(
    `${API_BASE_URL}/api/v1/portfolio-categories?${params.toString()}`
  );

  return parseResponse(r);
}

/* GET ONE */
export async function getPortfolioCategory(id) {
  const r = await fetch(
    `${API_BASE_URL}/api/v1/portfolio-categories/${id}`
  );

  return parseResponse(r);
}

/* CREATE */
export async function createPortfolioCategory(payload) {
  const r = await fetch(
    `${API_BASE_URL}/api/v1/portfolio-categories`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(r);
}

/* UPDATE */
export async function updatePortfolioCategory(id, payload) {
  const r = await fetch(
    `${API_BASE_URL}/api/v1/portfolio-categories/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(r);
}

/* DELETE */
export async function deletePortfolioCategory(id) {
  const r = await fetch(
    `${API_BASE_URL}/api/v1/portfolio-categories/${id}`,
    {
      method: "DELETE",
    }
  );

  return parseResponse(r);
}