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
  Lightbulb,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { NeonGradientCard } from "../../../utils/NeonCard";
import {
  availablePromptTypes,
  formatDate,
  truncateContent,
} from "../../../utils/availablePrompt";

interface NoteNodeData extends Note {
  onEdit: (note: Note) => void;
}

const NoteNode: React.FC<NodeProps<NoteNodeData>> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [showEnhanceInput, setShowEnhanceInput] = useState(false);

  const [suggestionText, setSuggestionText] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isSuggestionOpen,
    onOpen: onSuggestionOpen,
    onOpenChange: onSuggestionOpenChange,
  } = useDisclosure();

  const deleteNoteMutation = useDeleteNoteMutation();
  const enhanceNoteMutation = useEnhanceNoteMutation();

  const handleDelete = () => {
    console.log(enhancePrompt)
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
          onSuccess: (response: any) => {
            console.log(response, "response from ai");
            if (response.type === "enhanced") {
              toast.success("Note enhanced successfully!", {
                style: {
                  background: "#8B5CF6",
                  color: "white",
                },
              });
            } else if (response.type === "suggestion") {
              setSuggestionText(response.suggestion);
              onSuggestionOpen();

              toast.success("AI provided suggestions for improvement", {
                style: {
                  background: "#3B82F6",
                  color: "white",
                },
                duration: 4000,
              });
            }

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

            setShowEnhanceInput(false);
          },
        }
      );
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={enhanceNoteMutation.isPending}
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                {enhanceNoteMutation.isPending && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <span className="text-sm text-purple-400">
                      Enhancing note (may take up to 30 seconds)...
                    </span>
                  </div>
                )}
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
                  disabled={enhanceNoteMutation.isPending}
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
        size="sm"
        placement="center"
        classNames={{
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "bg-gray-900 border border-gray-700 max-w-lg w-full rounded-xl shadow-lg",
          header: "border-b border-gray-700 px-4 py-3",
          body: "px-4 py-3",
          footer: "border-t border-gray-700 px-4 py-3",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Delete Note
                    </h3>
                    <p className="text-xs text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-gray-300 text-sm mb-1">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-white">
                      "{data.title}"
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-400">
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
                  size="sm"
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
                  size="sm"
                >
                  {deleteNoteMutation.isPending ? "Deleting..." : "Delete Note"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={isSuggestionOpen}
        onOpenChange={onSuggestionOpenChange}
        backdrop="blur"
        size="lg"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "bg-gray-900 border border-gray-700 max-w-2xl w-full rounded-xl shadow-lg max-h-[80vh]",
          header: "border-b border-gray-700 px-6 py-4",
          body: "px-6 py-4",
          footer: "border-t border-gray-700 px-6 py-4",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      AI Suggestions
                    </h3>
                    <p className="text-sm text-gray-400">
                      Recommendations for improving your content
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-300 font-medium mb-2">
                          Content Enhancement Not Possible
                        </p>
                        <p className="text-xs text-blue-200/80">
                          The AI couldn't directly enhance your content but
                          provided these suggestions to help you improve it:
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {suggestionText}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-300">
                        <span className="font-medium">Tip:</span> Try editing
                        your note based on these suggestions, then attempt
                        enhancement again for better results.
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="ghost"
                  onPress={() => data.onEdit(data)}
                  className="text-gray-300 hover:text-white"
                  size="sm"
                >
                  Edit Note
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={onClose}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium"
                  size="sm"
                >
                  Got it
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
