import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { Note } from "redux/slice/noteSlice";
import {
  useDeleteNoteMutation,
  useEnhanceNoteMutation,
} from "../../../hooks/useNotesQuery";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@heroui/react";
import {
  Sparkles,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { NeonGradientCard } from "../../../utils/NeonCard";
import { availablePromptTypes } from "../../../utils/availablePrompt";

interface NoteNodeData extends Note {
  onEdit: (note: Note) => void;
}

const NoteNode: React.FC<NodeProps<NoteNodeData>> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [showEnhanceInput, setShowEnhanceInput] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteNoteMutation = useDeleteNoteMutation();
  const enhanceNoteMutation = useEnhanceNoteMutation();

  const handleDelete = () => {
    onOpen();
  };

  const confirmDelete = () => {
    deleteNoteMutation.mutate(data._id, {
      onSuccess: () => {
        toast.success("Note deleted successfully!", {
          style: {
            background: "#10B981",
            color: "white",
          },
        });
      },
      onError: () => {
        toast.error("Failed to delete note", {
          style: {
            background: "#EF4444",
            color: "white",
          },
        });
      },
    });
  };

  const handleEnhance = (promptType: string) => {
    if (promptType) {
      enhanceNoteMutation.mutate(
        {
          id: data._id,
          promptType: promptType,
        },
        {
          onSuccess: () => {
            toast.success("Note enhanced successfully!", {
              style: {
                background: "#8B5CF6",
                color: "white",
              },
            });
            setEnhancePrompt("");
            setShowEnhanceInput(false);
          },
          onError: () => {
            toast.error("Failed to enhance note", {
              style: {
                background: "#EF4444",
                color: "white",
              },
            });
          },
        }
      );
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    }
  };

  return (
    <>
      <NeonGradientCard className="min-w-[280px] max-w-[320px] hover:scale-[1.02] transition-all duration-300">
        <div className="p-5">
          <Handle
            type="target"
            position={Position.Top}
            style={{ opacity: 0 }}
          />

          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-white text-lg truncate flex-1 mr-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50 transition-all duration-200 group"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
              <button
                onClick={() => data.onEdit(data)}
                className="p-1.5 rounded-lg bg-gray-800/50 text-green-400 hover:text-green-300 hover:bg-gray-700/50 transition-all duration-200 group"
                title="Edit Note"
              >
                <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-gray-800/50 text-red-400 hover:text-red-300 hover:bg-gray-700/50 transition-all duration-200 group"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="text-gray-300 text-sm mb-4 leading-relaxed">
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              {isExpanded ? data.content : truncateContent(data.content)}
            </div>
          </div>

          <div className="border-t border-gray-700/50 pt-4 mb-4">
            {!showEnhanceInput ? (
              <button
                onClick={() => setShowEnhanceInput(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 group"
                disabled={enhanceNoteMutation.isPending}
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                AI Enhance
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-300">
                      <p className="font-medium mb-1">AI Enhancement Options</p>
                      <p className="text-blue-400/80 mb-2">
                        Please select one of the available enhancement types:
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {availablePromptTypes.map((promptType) => (
                    <button
                      key={promptType.value}
                      onClick={() => handleEnhance(promptType.value)}
                      disabled={enhanceNoteMutation.isPending}
                      className="w-full text-left p-3 bg-gray-800/50 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">
                            {promptType.label}
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            {promptType.description}
                          </div>
                        </div>
                        <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowEnhanceInput(false);
                    setEnhancePrompt("");
                  }}
                  className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                {enhanceNoteMutation.isPending && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <span className="text-sm text-purple-400">
                      Enhancing note...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(data.updatedAt)}</span>
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            style={{ opacity: 0 }}
          />
        </div>
      </NeonGradientCard>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "border-gray-700 bg-gray-900",
          header: "border-b border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-700",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Delete Note
                    </h3>
                    <p className="text-sm text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-gray-300 mb-2">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-white">
                      "{data.title}"
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-400">
                    This will permanently remove the note and all its content.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="ghost"
                  onPress={onClose}
                  className="text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onPress={() => {
                    confirmDelete();
                    onClose();
                  }}
                  isLoading={deleteNoteMutation.isPending}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-medium"
                >
                  {deleteNoteMutation.isPending ? "Deleting..." : "Delete Note"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default memo(NoteNode);
