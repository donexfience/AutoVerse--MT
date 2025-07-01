import React, { useCallback, useState, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
} from "reactflow";
import type { Connection, NodeChange } from "reactflow";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";
import NoteNode from "@/components/notes/NoteNode";
import type { RootState } from "redux/store";
import type { Note } from "types/types";
import {
  useNotesQuery,
  useUpdateNoteMutation,
} from "../../hooks/useNotesQuery";
import EditNoteModal from "@/components/modal/EditNoteModal";
import CreateNoteModal from "@/components/modal/CreateNoteModal";

const nodeTypes = {
  noteNode: NoteNode,
};

const NotesCanvas: React.FC = () => {
  const notes = useSelector((state: RootState) => state.notes.notes);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNotePosition, setNewNotePosition] = useState({ x: 100, y: 100 });

  const { isLoading, error } = useNotesQuery();
  const updateNoteMutation = useUpdateNoteMutation();

  // Convert notes to React Flow nodes
  const flowNodes = useMemo(() => {
    return notes.map((note) => ({
      id: note._id,
      type: "noteNode",
      position: note.position,
      data: {
        ...note,
        onEdit: (note: Note) => {
          setSelectedNote(note);
          setIsEditModalOpen(true);
        },
      },
    }));
  }, [notes]);

  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  // Handle node drag end to update position in backend
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      // Handle position updates
      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          const note = notes.find((n) => n._id === change.id);
          if (note && change.position) {
            updateNoteMutation.mutate({
              _id: note._id,
              position: change.position,
            });
          }
        }
      });
    },
    [notes, setNodes, updateNoteMutation]
  );

  // Handle canvas click to create new note
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    const canvasElement = event.currentTarget as HTMLElement;
    const rect = canvasElement.getBoundingClientRect();

    // Calculate position relative to canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setNewNotePosition({ x, y });
    setIsCreateModalOpen(true);
  }, []);

  // Handle edge connections (optional feature)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">Failed to load notes</p>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Notes Canvas</h1>
        <button
          onClick={() => {
            setNewNotePosition({ x: 100, y: 100 });
            setIsCreateModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Create Note
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Click anywhere on canvas to create a note
        </p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onClick={handleCanvasClick}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls position="bottom-right" />
        <MiniMap
          position="top-right"
          nodeColor={(node) => {
            return "#3b82f6";
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultPosition={newNotePosition}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />
    </div>
  );
};

export default NotesCanvas;
