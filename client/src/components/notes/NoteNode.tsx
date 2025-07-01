import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { Note } from "redux/slice/noteSlice";
import {
  useDeleteNoteMutation,
  useEnhanceNoteMutation,
} from "../../../hooks/useNotesQuery";

interface NoteNodeData extends Note {
  onEdit: (note: Note) => void;
}

const NoteNode: React.FC<NodeProps<NoteNodeData>> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [showEnhanceInput, setShowEnhanceInput] = useState(false);

  const deleteNoteMutation = useDeleteNoteMutation();
  const enhanceNoteMutation = useEnhanceNoteMutation();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(data._id);
    }
  };

  const handleEnhance = () => {
    if (enhancePrompt.trim()) {
      enhanceNoteMutation.mutate({
        id: data._id,
        prompt: enhancePrompt,
      });
      setEnhancePrompt("");
      setShowEnhanceInput(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 min-w-[250px] max-w-[300px]">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {/* Note Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 truncate flex-1 mr-2">
          {data.title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 text-sm"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
          <button
            onClick={() => data.onEdit(data)}
            className="text-gray-500 hover:text-gray-700 text-sm"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="text-gray-600 text-sm mb-3">
        {isExpanded ? data.content : truncateContent(data.content)}
      </div>

      <div className="border-t pt-2">
        {!showEnhanceInput ? (
          <button
            onClick={() => setShowEnhanceInput(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-1 px-3 rounded text-sm hover:from-purple-600 hover:to-blue-600 transition-all"
            disabled={enhanceNoteMutation.isLoading}
          >
            ✨ AI Enhance
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.value)}
              placeholder="Enter enhancement prompt..."
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleEnhance()}
            />
            <div className="flex gap-1">
              <button
                onClick={handleEnhance}
                disabled={
                  !enhancePrompt.trim() || enhanceNoteMutation.isLoading
                }
                className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 disabled:bg-gray-300"
              >
                {enhanceNoteMutation.isLoading ? "Enhancing..." : "Enhance"}
              </button>
              <button
                onClick={() => {
                  setShowEnhanceInput(false);
                  setEnhancePrompt("");
                }}
                className="flex-1 bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-400 mt-2">
        Updated: {new Date(data.updatedAt).toLocaleDateString()}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default memo(NoteNode);
