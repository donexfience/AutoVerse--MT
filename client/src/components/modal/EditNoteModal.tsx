import type { Note } from "types/types";
import { useUpdateNoteMutation } from "../../../hooks/useNotesQuery";
import React, { useEffect, useState } from "react";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

interface FormData {
  title: string;
  content: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const updateNoteMutation = useUpdateNoteMutation();

  useEffect(() => {
    if (note) {
      setFormData({ title: note.title, content: note.content });
      setErrors({});
    }
  }, [note]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length > 100)
      newErrors.title = "Must be under 100 characters";

    if (!formData.content.trim()) newErrors.content = "Content is required";
    else if (formData.content.length > 5000)
      newErrors.content = "Max 5000 characters allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note || !validateForm()) return;

    try {
      await updateNoteMutation.mutateAsync({
        _id: note._id,
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      onClose();
    } catch (error) {
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg mx-4 transform animate-slide-up duration-300 transition-all border border-zinc-700">
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">✏️ Edit Note</h2>
              <p className="text-white/80 text-sm mt-1">
                Update your note content
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-white">
          <div className="space-y-2">
            <label htmlFor="edit-title" className="block text-sm font-medium">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h3v-2H5V5h10v10h-2v2h3a1 1 0 001-1V4a1 1 0 00-1-1H4z" />
                </svg>
                Title <span className="text-pink-400">*</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Short and clear note title
              </p>
            </label>
            <input
              id="edit-title"
              type="text"
              maxLength={100}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border-2 focus:outline-none transition-all ${
                errors.title
                  ? "border-red-500 focus:border-red-600"
                  : "border-zinc-700 focus:border-purple-500"
              }`}
              placeholder="Update your title..."
            />
            <div className="text-xs text-right text-zinc-500">
              {formData.title.length}/100
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-content" className="block text-sm font-medium">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a1 1 0 011-1h10a1 1 0 011 1v1H4V3zM4 6h12v1H4V6zm0 3h12v1H4V9zm0 3h8v1H4v-1z" />
                </svg>
                Content <span className="text-pink-400">*</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Keep it clear and meaningful
              </p>
            </label>
            <textarea
              id="edit-content"
              rows={6}
              maxLength={5000}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border-2 resize-none focus:outline-none transition-all ${
                errors.content
                  ? "border-red-500 focus:border-red-600"
                  : "border-zinc-700 focus:border-purple-500"
              }`}
              placeholder="Update your note content..."
            />
            <div className="text-xs text-right text-zinc-500">
              {formData.content.length}/5000
            </div>
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-zinc-600 text-zinc-300 rounded-xl hover:bg-zinc-700 hover:border-zinc-500 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateNoteMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {updateNoteMutation.isPending ? "Updating..." : "Update Note"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(6px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EditNoteModal;
