/**
 * Generic reusable list manager for Testimonials, FAQ, Services, Industries, Process Steps.
 * Pass config props describing the entity and fields.
 */
import React, { useEffect, useState } from "react";
import jsonService from "@/lib/jsonService";
import AdminGuard from "@/components/admin/AdminGuard";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { logAudit } from "@/lib/adminAudit";
import { Plus, Pencil, Trash2, GripVertical, X, Check, Upload, Star, ToggleLeft, ToggleRight } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

function FieldInput({ field, value, onChange }) {
  const base = "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-100";

  if (field.type === "textarea") return (
    <textarea rows={3} value={value || ""} onChange={e => onChange(e.target.value)} className={base + " resize-none"} placeholder={field.placeholder} />
  );
  if (field.type === "number") return (
    <input type="number" value={value || ""} onChange={e => onChange(e.target.value)} className={base} />
  );
  if (field.type === "stars") return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star size={20} className={n <= (value||5) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
        </button>
      ))}
    </div>
  );
  if (field.type === "image") return (
    <div className="space-y-2">
      {value && <img src={getImageUrl(value)} alt="" className="w-24 h-16 object-cover rounded-lg border" />}
      <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 text-sm text-slate-500 w-fit">
        <Upload size={13} /> Upload image
        <input type="file" accept="image/*" className="hidden" onChange={async e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const res = await jsonService.integrations.Core.UploadFile({ file });
          onChange(res.file_url);
        }} />
      </label>
    </div>
  );
  return (
    <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} className={base} placeholder={field.placeholder} />
  );
}

export default function AdminListPage({ title, description, entityName, fields, orderField = "display_order", auditSection }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({});

  const [entityCache, setEntityCache] = useState(null);

  useEffect(() => {
    jsonService.getEntity(entityName).then(e => {
      setEntityCache(e);
      e.list(orderField, 200).then(r => { setItems(r); setLoading(false); });
    });
  }, [entityName, orderField]);

  const getEntity = async () => entityCache || (await jsonService.getEntity(entityName));

  const startEdit = (item) => { setEditingId(item.id); setEditForm({ ...item }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    const ent = await getEntity();
    const prev = items.find(i => i.id === editingId);
    await ent.update(editingId, editForm);
    setItems(p => p.map(i => i.id === editingId ? { ...i, ...editForm } : i));
    await logAudit({ action: "Updated", section: auditSection || title, description: `Edited: ${editForm[fields[0].key]}`, previousValue: prev, newValue: editForm });
    toast({ title: "Saved" });
    cancelEdit();
  };

  const handleAdd = async () => {
    const ent = await getEntity();
    const maxOrder = items.reduce((m, i) => Math.max(m, i[orderField] || 0), 0);
    const data = { ...addForm, [orderField]: maxOrder + 1, is_active: true };
    const created = await ent.create(data);
    setItems(p => [...p, created]);
    await logAudit({ action: "Created", section: auditSection || title, description: `Added: ${addForm[fields[0].key]}` });
    toast({ title: "Added" });
    setShowAdd(false);
    setAddForm({});
  };

  const handleDelete = async () => {
    const ent = await getEntity();
    const item = items.find(i => i.id === deleteId);
    await ent.delete(deleteId);
    setItems(p => p.filter(i => i.id !== deleteId));
    await logAudit({ action: "Deleted", section: auditSection || title, description: `Deleted: ${item?.[fields[0].key]}` });
    toast({ title: "Deleted" });
    setDeleteId(null);
  };

  const toggleActive = async (item) => {
    const ent = await getEntity();
    const updated = { ...item, is_active: !item.is_active };
    await ent.update(item.id, { is_active: updated.is_active });
    setItems(p => p.map(i => i.id === item.id ? updated : i));
  };

  const moveItem = async (id, dir) => {
    const ent = await getEntity();
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const newItems = [...items];
    const a = { ...newItems[idx], [orderField]: newItems[swapIdx][orderField] };
    const b = { ...newItems[swapIdx], [orderField]: newItems[idx][orderField] };
    newItems[idx] = a; newItems[swapIdx] = b;
    setItems(newItems.sort((x, y) => (x[orderField] || 0) - (y[orderField] || 0)));
    await ent.update(a.id, { [orderField]: a[orderField] });
    await ent.update(b.id, { [orderField]: b[orderField] });
  };

  return (
    <AdminGuard>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            onClick={() => { setShowAdd(true); setAddForm({}); }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            <Plus size={15} /> Add New
          </button>
        }
      />

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-orange-200 p-5 mb-5">
          <h3 className="font-semibold text-slate-800 mb-4">Add New</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.filter(f => !f.readonly).map(f => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
                <FieldInput field={f} value={addForm[f.key]} onChange={v => setAddForm(p => ({ ...p, [f.key]: v }))} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">
              <Check size={14} className="inline mr-1" />Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              <X size={14} className="inline mr-1" />Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No items yet. Click "Add New" to get started.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={item.id} className="p-4">
                {editingId === item.id ? (
                  <div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {fields.filter(f => !f.readonly).map(f => (
                        <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
                          <FieldInput field={f} value={editForm[f.key]} onChange={v => setEditForm(p => ({ ...p, [f.key]: v }))} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveEdit} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">
                        <Check size={14} className="inline mr-1" />Save
                      </button>
                      <button onClick={cancelEdit} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                        <X size={14} className="inline mr-1" />Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveItem(item.id, -1)} className="text-slate-300 hover:text-slate-600 text-xs leading-none">▲</button>
                      <button onClick={() => moveItem(item.id, 1)} className="text-slate-300 hover:text-slate-600 text-xs leading-none">▼</button>
                    </div>
                    {item.photo_url && <img src={getImageUrl(item.photo_url)} alt="" className="w-10 h-10 rounded-full object-cover border flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{item[fields[0].key]}</div>
                      {fields[1] && <div className="text-xs text-slate-400 truncate mt-0.5">{item[fields[1].key]}</div>}
                    </div>
                    {item.rating && (
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(n => <Star key={n} size={12} className={n <= item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />)}
                      </div>
                    )}
                    <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg hover:bg-slate-100" title="Toggle visibility">
                      {item.is_active
                        ? <ToggleRight size={18} className="text-green-500" />
                        : <ToggleLeft size={18} className="text-slate-300" />}
                    </button>
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={o => !o && setDeleteId(null)}
        title="Delete item?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
      />
    </AdminGuard>
  );
}