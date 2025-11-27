import React, { useState } from "react";
import { NodeIcon } from "./NodeIcon";
import { NodeActions } from "./NodeActions";
import { useDataroom } from "@/state/useDataroom";
import { getFile } from "@/lib/fileStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type NodeType = "folder" | "file";

interface BaseNode {
  id: string;
  type: NodeType;
  name: string;
  updatedAt: string;
}

interface FileNode extends BaseNode {
  type: "file";
  size: string;
}

interface FolderNode extends BaseNode {
  type: "folder";
}

export type Node = FileNode | FolderNode;

interface Props {
  node: Node;
}

export const NodeRow: React.FC<Props> = ({ node }) => {
  const { state, dispatch } = useDataroom();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpen = () => {
    if (node.type === "folder") {
      dispatch({
        type: "SET_CURRENT_FOLDER",
        payload: { folderId: node.id },
      });
    } else {
      const fileNode = state.data.files[node.id];
      if (!fileNode) return;
      const file = getFile(fileNode.storageKey);
      if (!file) {
        alert("File content not found in memory storage");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewOpen(true);
    }
  };

  const handlePreviewClose = (open: boolean) => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPreviewOpen(open);
  };

  return (
    <>
      <div
        className="grid w-full grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] items-center px-3 py-2 text-left hover:bg-slate-900/60 border-b border-slate-900/60 last:border-0 cursor-pointer"
        onClick={handleOpen}
      >
        <div className="flex items-center gap-2">
          <NodeIcon type={node.type} />
          <span className="truncate">{node.name}</span>
        </div>
        <div className="text-xs text-slate-400">
          {new Date(node.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <NodeActions node={node} />
        </div>
      </div>

      {node.type === "file" && (
        <Dialog open={previewOpen} onOpenChange={handlePreviewClose}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{node.name}</DialogTitle>
            </DialogHeader>
            {previewUrl ? (
              <div className="flex-1 overflow-hidden rounded-md border border-slate-800">
                <iframe
                  src={previewUrl}
                  title={node.name}
                  className="w-full h-[65vh]"
                />
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                Unable to load document
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
