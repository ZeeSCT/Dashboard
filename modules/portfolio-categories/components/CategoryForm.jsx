"use client";

import { Plus } from "lucide-react";
import { createCategoryAction } from "../actions";

export default function CategoryForm() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5 font-semibold text-lg">
        <Plus size={18} />
        Create Portfolio Category
      </div>

      <form action={createCategoryAction} className="grid md:grid-cols-2 gap-4">
        <input
          name="code"
          placeholder="Code"
          className="border rounded-xl px-3 py-2"
          required
        />

        <input
          name="name"
          placeholder="Name"
          className="border rounded-xl px-3 py-2"
          required
        />

        <input
          name="displayOrder"
          type="number"
          placeholder="Display Order"
          className="border rounded-xl px-3 py-2"
          defaultValue="0"
        />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked />
          Active
        </label>

        <textarea
          name="description"
          rows="3"
          placeholder="Description"
          className="border rounded-xl px-3 py-2 md:col-span-2"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-fit hover:bg-blue-700">
          Save Category
        </button>
      </form>
    </div>
  );
}