import AdminListPage from "./AdminListPage";

const FIELDS = [
  { key: "question", label: "Question" },
  { key: "answer", label: "Answer", type: "textarea" },
];

export default function AdminFAQ() {
  return (
    <AdminListPage
      title="FAQ"
      description="Manage frequently asked questions"
      entityName="FAQ"
      fields={FIELDS}
      auditSection="FAQ"
    />
  );
}