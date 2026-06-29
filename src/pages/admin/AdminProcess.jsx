import AdminListPage from "./AdminListPage";

const FIELDS = [
  { key: "step_number", label: "Step Number (e.g. 01)" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon name (lucide)" },
];

export default function AdminProcess() {
  return (
    <AdminListPage
      title="Recruitment Process"
      description="Manage the recruitment timeline steps"
      entityName="ProcessStep"
      fields={FIELDS}
      auditSection="Process Steps"
    />
  );
}