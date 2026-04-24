export function mapPortfolioCategoriesToScreen(data) {
  const items = data.items || [];

  const active = items.filter((x) => x.isActive).length;
  const inactive = items.length - active;

  return {
    meta: {
      badge: { label: "Admin", tone: "blue" },
      note: "Portfolio Categories Management",
    },

    kpis: [
      {
        label: "Total Categories",
        value: String(items.length),
        subtext: "All records",
      },
      {
        label: "Active",
        value: String(active),
        subtext: "Enabled",
      },
      {
        label: "Inactive",
        value: String(inactive),
        subtext: "Disabled",
      },
      {
        label: "Pages",
        value: String(data.meta?.totalPages || 1),
        subtext: "Pagination",
      },
    ],

    topPanels: [
      {
        title: "Latest Categories",
        type: "list",
        items: items.slice(0, 5).map((item) => ({
          title: item.name,
          meta: item.code,
          color: "var(--blue)",
        })),
      },

      {
        title: "Status Split",
        type: "summary",
        items: [
          {
            label: "Active",
            badge: { label: String(active), tone: "green" },
            progress: items.length
              ? Math.round((active / items.length) * 100)
              : 0,
            color: "var(--green)",
          },
          {
            label: "Inactive",
            badge: { label: String(inactive), tone: "gray" },
            progress: items.length
              ? Math.round((inactive / items.length) * 100)
              : 0,
            color: "var(--gray)",
          },
        ],
      },
    ],

    tables: [
      {
        title: "Categories List",
        subtitle: `${items.length} rows`,
        columns: [
          { key: "code", label: "Code" },
          { key: "name", label: "Name" },
          { key: "displayOrder", label: "Order" },
          { key: "status", label: "Status", type: "status" },
          { key: "createdAt", label: "Created" },
        ],

        rows: items.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          displayOrder: item.displayOrder,
          status: item.isActive
            ? { label: "Active", tone: "green" }
            : { label: "Inactive", tone: "gray" },
          createdAt: item.createdAt.slice(0, 10),
        })),
      },
    ],
  };
}