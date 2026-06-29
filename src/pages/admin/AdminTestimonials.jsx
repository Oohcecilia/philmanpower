import AdminListPage from "./AdminListPage";

const FIELDS = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role / Position" },
  { key: "company", label: "Company" },
  { key: "text", label: "Testimonial Text", type: "textarea" },
  { key: "rating", label: "Rating", type: "stars" },
  { key: "photo_url", label: "Photo", type: "image" },
];

export default function AdminTestimonials() {
  return (
    <AdminListPage
      title="Testimonials"
      description="Manage client testimonials shown on the website"
      entityName="Testimonial"
      fields={FIELDS}
      auditSection="Testimonials"
    />
  );
}