import React from "react";
import { NodeRow, type Node } from "./NodeRow";
import { useDataroom } from "@/state/useDataroom";

function formatSize(bytes: number): string {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

interface NodeTableProps {
  searchTerm: string;
}

export const NodeTable: React.FC<NodeTableProps> = ({ searchTerm }) => {
  const { state } = useDataroom();
  const { currentFolderId, currentDataroomId } = state.ui;

  const { folders, files } = React.useMemo(() => {
    if (!currentDataroomId || !currentFolderId) {
      return { folders: [], files: [] };
    }

    const filteredFolders = Object.values(state.data.folders).filter(
      (f) => f.parentId === currentFolderId && f.dataroomId === currentDataroomId
    );

    const filteredFiles = Object.values(state.data.files).filter(
      (f) => f.parentId === currentFolderId && f.dataroomId === currentDataroomId
    );

    return { folders: filteredFolders, files: filteredFiles };
  }, [state.data.folders, state.data.files, currentFolderId, currentDataroomId]);

  if (!currentDataroomId || !currentFolderId) {
    return <div className="text-xs text-slate-500">No folder selected</div>;
  }

  const nodes: Node[] = [
    ...folders.map((f) => ({
      id: f.id,
      type: "folder" as const,
      name: f.name,
      updatedAt: f.updatedAt,
    })),
    ...files.map((f) => ({
      id: f.id,
      type: "file" as const,
      name: f.name,
      updatedAt: f.updatedAt,
      size: formatSize(f.size),
    })),
  ];

  if (nodes.length === 0) {
    return (
      <div className="border border-dashed border-slate-700 rounded-lg px-4 py-8 text-center text-sm text-slate-400">
        This folder is empty. Create a folder or upload a file.
      </div>
    );
  }

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredNodes =
    normalizedQuery.length === 0
      ? nodes
      : nodes.filter((node) =>
          node.name.toLowerCase().includes(normalizedQuery)
        );

  if (filteredNodes.length === 0) {
    return (
      <div className="border border-slate-800 rounded-lg px-4 py-6 text-sm text-slate-400">
        No items match <span className="font-mono">"{searchTerm}"</span> in this
        folder.
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden text-sm">
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] bg-slate-900/80 border-b border-slate-800 px-3 py-2 text-xs text-slate-400">
        <div>Name</div>
        <div>Last modified</div>
        <div className="text-right">Actions</div>
      </div>
      <div>
        {filteredNodes.map((node) => (
          <NodeRow key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};
