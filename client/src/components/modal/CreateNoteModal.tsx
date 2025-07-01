import { useCreateNoteMutation } from "../../../hooks/useNotesQuery";
import React, { useEffect, useState } from "react";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: { x: number; y: number };
}

interface FormData {
  title: string;
  content: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  defaultPosition = { x: 100, y: 100 },
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const createNoteMutation = useCreateNoteMutation();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length > 5000) {
      newErrors.content = "Content must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createNoteMutation.mutateAsync({
        title: formData.title.trim(),
        content: formData.content.trim(),
        position: defaultPosition,
      });
      setFormData({ title: "", content: "" });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg mx-4 transform animate-slide-up duration-300 transition-all border border-zinc-700">
        <div className="bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-700 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                📝 Create a Note
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Write down your thoughts, ideas or plans here
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-white">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
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
                Give a short, descriptive title
              </p>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              maxLength={100}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border-2 focus:outline-none transition-all ${
                errors.title
                  ? "border-red-500 focus:border-red-600"
                  : "border-zinc-700 focus:border-purple-500"
              }`}
              placeholder="e.g., Weekly Planning"
            />
            <div className="text-xs text-right text-zinc-500">
              {formData.title.length}/100
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
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
                Add details or descriptions
              </p>
            </label>
            <textarea
              id="content"
              rows={6}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              maxLength={5000}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 border-2 resize-none focus:outline-none transition-all ${
                errors.content
                  ? "border-red-500 focus:border-red-600"
                  : "border-zinc-700 focus:border-purple-500"
              }`}
              placeholder="Write your thoughts here..."
            />
            <div className="text-xs text-right text-zinc-500">
              {formData.content.length}/5000
            </div>
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-zinc-600 text-zinc-300 rounded-xl hover:bg-zinc-700 hover:border-zinc-500 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createNoteMutation.isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {createNoteMutation.isLoading ? "Creating..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
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

export default CreateNoteModal;
