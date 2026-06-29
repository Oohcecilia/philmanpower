import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Trash2, CheckCircle, AlertTriangle, Eye, Download } from "lucide-react";

const STATUS_COLORS = {
  new: "bg-orange-50 text-orange-600 border-orange-100",
  contacted: "bg-green-50 text-green-600 border-green-100",
  spam: "bg-red-50 text-red-500 border-red-100",
};

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  let entity = null;

  const load = async () => {
    setLoading(true);
    entity = await jsonService.getEntity('ContactSubmission');
    entity.list("-created_date", 200)
      .then(r => { setItems(r); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i => {
    const matchFilter = filter === "all" || i.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q) || i.company?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const updateStatus = async (id, status) => {
    const e = await jsonService.getEntity('ContactSubmission');
    await e.update(id, { status });
    setItems(p => p.map(i => i.id === id ? { ...i, status } : i));
    toast({ title: "Updated", description: `Marked as ${status}.` });
  };

  const handleDelete = async () => {
    const e = await jsonService.getEntity('ContactSubmission');
    await e.delete(deleteId);
    setItems(p => p.filter(i => i.id !== deleteId));
    setDeleteId(null);
    if (selected?.id === deleteId) setSelected(null);
    toast({ title: "Deleted" });
  };

  const exportCSV = () => {
    const rows = [["Name","Company","Email","Phone","Country","Industry","Employees","Start Date","Message","Status","Date"]];
    filtered.forEach(i => rows.push([i.name,i.company,i.email,i.phone,i.country,i.industry,i.employees_needed,i.start_date,i.message,i.status,i.created_date]));
    const csv = rows.map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "submissions.csv";
    a.click();
  };

  return (
    <AdminGuard>
      <PageHeader
        title="Contact Submissions"
        description="View and manage all contact form inquiries"
        action={
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-400 w-56"
          />
        </div>
        {["all","new","contacted","spam"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${filter === f ? "bg-orange-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No submissions found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Industry</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === s.id ? "bg-orange-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{s.company || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{s.industry || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[s.status] || STATUS_COLORS.new}`}>
                        {s.status || "new"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end" onClick={e => e.stopPropagation()}>
                        <button onClick={() => updateStatus(s.id, "contacted")} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500" title="Mark contacted">
                          <CheckCircle size={15} />
                        </button>
                        <button onClick={() => updateStatus(s.id, "spam")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" title="Mark spam">
                          <AlertTriangle size={15} />
                        </button>
                        <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 p-5 self-start sticky top-0">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-slate-800">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Company", selected.company],
                ["Country", selected.country],
                ["Industry", selected.industry],
                ["Employees Needed", selected.employees_needed],
                ["Start Date", selected.start_date],
              ].map(([k, v]) => v ? (
                <div key={k}>
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{k}</dt>
                  <dd className="text-slate-700 mt-0.5">{v}</dd>
                </div>
              ) : null)}
              {selected.message && (
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Message</dt>
                  <dd className="text-slate-700 mt-0.5 whitespace-pre-wrap">{selected.message}</dd>
                </div>
              )}
              {selected.file_url && (
                <div>
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Attachment</dt>
                  <a href={selected.file_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-xs hover:underline mt-0.5 block">View file →</a>
                </div>
              )}
            </dl>
            <div className="flex gap-2 mt-5">
              <button onClick={() => updateStatus(selected.id, "contacted")} className="flex-1 py-2 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                Mark Contacted
              </button>
              <button onClick={() => { setDeleteId(selected.id); }} className="px-3 py-2 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete Submission?"
        description="This will permanently delete this contact submission."
        onConfirm={handleDelete}
      />
    </AdminGuard>
  );
}