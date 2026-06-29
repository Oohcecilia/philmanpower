import AdminListPage from "./AdminListPage";

const FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "icon", label: "Icon name (lucide)" },
  { key: "image_url", label: "Image", type: "image" },
];

export default function AdminServices() {
  return (
    <AdminListPage
      title="Services"
      description="Manage services offered by PhilManPower"
      entityName="Service"
      fields={FIELDS}
      auditSection="Services"
    />
  );
}