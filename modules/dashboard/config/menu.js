export const menuSections = [
  {
    title: "Executive",
    items: [
      {
        slug: "portfolio",
        label: "Portfolio overview",
        color: "var(--blue)",
        group: "Executive",
      },
      {
        slug: "health",
        label: "Project health",
        color: "var(--green)",
        group: "Executive",
      },
    ],
  },
  {
    title: "Tender Management",
    items: [
      {
        slug: "tender-pipeline",
        label: "Tender pipeline",
        color: "var(--purple)",
        group: "Tender",
      },
      {
        slug: "tender-enquiry",
        label: "Enquiry register",
        color: "var(--blue)",
        group: "Tender",
      },
    ],
  },
  {
    title: "PM & Engineer",
    items: [
      {
        slug: "workspace",
        label: "Project workspace",
        color: "var(--blue)",
        group: "PM & Engineer",
      },
      {
        slug: "milestones",
        label: "Milestone tracker",
        color: "var(--teal)",
        group: "PM & Engineer",
      },
    ],
  },
  {
    title: "QA / QC",
    items: [
      {
        slug: "qainspections",
        label: "Inspection register",
        color: "var(--teal)",
        group: "QA / QC",
      },
      {
        slug: "qancr",
        label: "NCR log",
        color: "var(--red)",
        group: "QA / QC",
      },
    ],
  },
  {
    title: "Procurement",
    items: [
      {
        slug: "proc-mr",
        label: "Material requests",
        color: "var(--blue)",
        group: "Procurement",
      },
      {
        slug: "proc-rfq",
        label: "RFQ tracker",
        color: "var(--amber)",
        group: "Procurement",
      },
    ],
  },
  {
    title: "Maintenance",
    items: [
      {
        slug: "maint-dash",
        label: "Maintenance dashboard",
        color: "var(--purple)",
        group: "Maintenance",
      },
      {
        slug: "maint-cm",
        label: "Corrective tasks",
        color: "var(--red)",
        group: "Maintenance",
      },
    ],
  },
];
export const allMenuItems = menuSections.flatMap((section) => section.items);
