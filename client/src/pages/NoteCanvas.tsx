import { useCallback, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  BackgroundVariant,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector, useDispatch } from "react-redux";
import NoteNode from "@/components/notes/NoteNode";
import type { RootState } from "redux/store";
import type { Note } from "types/types";
import { useNotesQuery } from "../../hooks/useNotesQuery";
import { updateNote } from "../../redux/slice/noteSlice";
import EditNoteModal from "@/components/modal/EditNoteModal";
import CreateNoteModal from "@/components/modal/CreateNoteModal";
import { debounce } from "lodash";
import { Plus, FileText, Sparkles } from "lucide-react";
import { Avatar } from "@heroui/react";
import { LoadingSkeleton } from "../../utils/LoadingSkeleton";

const nodeTypes = {
  noteNode: NoteNode,
};

const NotesCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes.notes);
  const userId = useSelector((state: RootState) => state.user.userId);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNotePosition, setNewNotePosition] = useState({ x: 100, y: 100 });
  const [socket, setSocket] = useState<any>(null);

  const { isLoading, error } = useNotesQuery();
  const { project } = useReactFlow();

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL_SOCKET || "http://localhost:3000"
    );
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const debouncedUpdate = useMemo(
    () =>
      debounce((noteId: string, position: { x: number; y: number }) => {
        if (socket) {
          socket.emit("updateNotePosition", { noteId, position, userId });

          const noteToUpdate = notes.find((n) => n._id === noteId);
          if (noteToUpdate) {
            dispatch(
              updateNote({
                ...noteToUpdate,
                position: position,
              })
            );
          }
        }
      }, 300),
    [socket, notes, dispatch]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change: any) => {
        if (change.type === "position" && change.position) {
          const note = notes.find((n) => n._id === change.id);
          if (note) {
            debouncedUpdate(change.id, change.position);
          }
        }
      });
    },
    [notes, setNodes, debouncedUpdate]
  );

  useEffect(() => {
    if (socket) {
      socket.on(
        "notePositionUpdated",
        ({ noteId, position }: { noteId: string; position: any }) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === noteId) {
                return { ...node, position };
              }
              return node;
            })
          );

          const noteToUpdate = notes.find((n) => n._id === noteId);
          if (noteToUpdate) {
            dispatch(
              updateNote({
                ...noteToUpdate,
                position: position,
              })
            );
          }
        }
      );

      socket.on("error", (message: string) => {
        console.error(message, "socket error");
      });
    }

    return () => {
      if (socket) {
        socket.off("notePositionUpdated");
        socket.off("error");
      }
    };
  }, [socket, setNodes, notes, dispatch]);

  const flowNodes = useMemo(() => {
    return notes.map((note) => ({
      id: note._id,
      type: "noteNode",
      position: note.position || {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
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

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.classList.contains("react-flow__pane") ||
        target.classList.contains("react-flow__renderer")
      ) {
        const reactFlowBounds = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const adjustedPosition = {
          x: position.x - 150,
          y: position.y - 100,
        };
        setNewNotePosition(adjustedPosition);
        setIsCreateModalOpen(true);
      }
    },
    [project]
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleCreateNoteClick = useCallback(() => {
    const randomPosition = {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    setNewNotePosition(randomPosition);
    setIsCreateModalOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">Failed to load notes</p>
          <p className="text-sm text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-gray-900">
      <div className="absolute top-0 left-0 right-0 z-20 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notes Canvas</h1>
              <p className="text-sm text-gray-400">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateNoteClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>
            <Avatar
              isBordered
              color="primary"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              className="w-10 h-10"
            />
          </div>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="absolute top-20 left-6 z-10 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-4 mt-4">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Click anywhere on canvas to create a note
          </p>
        </div>
      )}

      {notes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pt-20">
          <div className="text-center max-w-md mx-auto p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 pointer-events-auto">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Start Your Journey
              </h2>
              <p className="text-gray-400 mb-6">
                Create your first note and begin organizing your thoughts in
                this beautiful canvas.
              </p>
            </div>
            <button
              onClick={handleCreateNoteClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto text-lg"
            >
              <Plus className="w-6 h-6" />
              Create Your First Note
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Or click anywhere on the canvas to get started
            </p>
          </div>
        </div>
      )}

      <div className="pt-20 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onPaneClick={handlePaneClick}
          fitView={notes.length > 0}
          attributionPosition="bottom-left"
          className="bg-gray-900"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#374151"
            gap={24}
            size={1}
            variant={BackgroundVariant.Cross}
            style={{ backgroundColor: "#111827" }}
          />
          <Controls
            position="bottom-right"
            className="bg-gray-800 border-gray-700"
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "12px",
              padding: "8px",
            }}
          />
          <MiniMap
            position="top-right"
            nodeColor={() => "#3b82f6"}
            nodeStrokeWidth={2}
            maskColor="rgba(17, 24, 39, 0.8)"
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "12px",
              marginTop: "20px",
            }}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>

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

      <style>{`
        .react-flow__controls-button {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          color: #d1d5db !important;
        }
        .react-flow__controls-button:hover {
          background-color: #4b5563 !important;
        }
        .react-flow__minimap {
          background-color: #1f2937 !important;
        }
        .react-flow__attribution {
          background-color: #1f2937 !important;
          color: #6b7280 !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
        }
      `}</style>
    </div>
  );
};

export default NotesCanvas;
