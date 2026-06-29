import AdminListPage from "./AdminListPage";

const FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon name (lucide)" },
  { key: "roles", label: "Roles (comma-separated)", type: "textarea" },
];

export default function AdminIndustries() {
  return (
    <AdminListPage
      title="Industries"
      description="Manage industry cards on the homepage"
      entityName="Industry"
      fields={FIELDS}
      auditSection="Industries"
    />
  );
}