import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/trips";
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Map,
  AlertCircle,
  FolderKanban,
  Tag,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";

const BASE_CATEGORIES = [
  "Adventure & Trekking",
  "Cultural & Heritage Tours",
  "Leisure & Offbeat Escapes",
  "Spiritual & Wellness Retreats",
];

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null); // category object to delete
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCats = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setErrorMsg("Failed to load categories. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCreating(true);
      setErrorMsg("");
      await createCategory({ name: newCatName.trim() });
      setNewCatName("");
      await fetchCats();
    } catch (err) {
      console.error("Failed to create category:", err);
      setErrorMsg(err?.response?.data?.error || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editingId) return;
    try {
      setSavingEdit(true);
      setErrorMsg("");
      await updateCategory(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName("");
      await fetchCats();
    } catch (err) {
      console.error("Failed to update category:", err);
      setErrorMsg(err?.response?.data?.error || "Failed to update category");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await deleteCategory(deleteModal.id);
      setDeleteModal(null);
      await fetchCats();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tour Categories
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Manage your 4 core base categories and add custom expedition genres for your website.
          </p>
        </div>

        <Link
          to="/itineraries"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
        >
          <Map className="w-3.5 h-3.5 text-slate-500" />
          <span>View Itineraries</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Category Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Add New Category</h3>
            <p className="text-[11px] text-slate-400">
              Create a new category to organize your travel itineraries
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="e.g. Winter Snow Treks, Himalayan Expeditions..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={creating || !newCatName.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
          Active Categories ({categories.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat) => {
            const isBase = BASE_CATEGORIES.includes(cat.name);
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Edit Category Name</span>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-orange-300 text-xs focus:outline-none focus:border-orange-500 bg-orange-50/20"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={handleSaveEdit}
                        disabled={savingEdit || !editName.trim()}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1"
                      >
                        {savingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                            {isBase && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-semibold text-slate-500">
                                Core
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {cat.tripCount || 0} {cat.tripCount === 1 ? "tour assigned" : "tours assigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Rename Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono text-[10px] text-slate-400">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "Default"}
                      </span>
                      <Link
                        to={`/itineraries`}
                        className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 text-[10px]"
                      >
                        <span>Filter Tours</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Delete "{deleteModal.name}"?
              </h4>
              <p className="text-xs text-slate-500">
                {deleteModal.tripCount > 0 ? (
                  <span className="text-red-600 font-semibold">
                    Warning: There are {deleteModal.tripCount} tours currently using this category.
                  </span>
                ) : (
                  "Are you sure you want to delete this category?"
                )}
              </p>
            </div>
            <div className="flex gap-2.5 pt-1.5">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-md shadow-red-500/25"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;

