import React, { useState, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Node } from "./NodeRow";
import { useDataroom } from "@/state/useDataroom";
import { toast } from "sonner";
import { hasSameExtension } from "@/lib/naming";
import { getFile } from "@/lib/fileStorage";

interface NodeActionsProps {
  node: Node;
}

export const NodeActions: React.FC<NodeActionsProps> = ({ node }) => {
  const { state, dispatch } = useDataroom();

  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRenameSubmit = () => {
    const name = newName.trim();

    if (!name) {
      toast.error("Name cannot be empty.");
      inputRef.current?.focus();
      inputRef.current?.select();
      return;
    }

    if (name === node.name) {
      setRenameOpen(false);
      return;
    }

    if (node.type === "file" && !hasSameExtension(node.name, name)) {
      toast.error(
        "You can rename the file name, but the file extension must stay the same (PDF only in this demo)."
      );
      inputRef.current?.focus();
      inputRef.current?.select();
      return;
    }

    if (node.type === "file") {
      dispatch({
        type: "RENAME_FILE",
        payload: { fileId: node.id, name },
      });
      toast.success("File renamed");
    } else {
      dispatch({
        type: "RENAME_FOLDER",
        payload: { folderId: node.id, name },
      });
      toast.success("Folder renamed");
    }

    setRenameOpen(false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type !== "file") return;

    const fileNode = state.data.files[node.id];
    if (!fileNode) {
      toast.error("File metadata not found. Please refresh the page.");
      return;
    }

    const file = getFile(fileNode.storageKey);
    if (!file) {
      toast.error(
        "File content is no longer available in this demo. Please re-upload the file."
      );
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileNode.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download file.");
    }
  };

  const handleConfirmDelete = () => {
    if (node.type === "file") {
      dispatch({
        type: "DELETE_FILE",
        payload: { fileId: node.id },
      });
      toast.success("File deleted");
    } else {
      dispatch({
        type: "DELETE_FOLDER",
        payload: { folderId: node.id },
      });
      toast.success("Folder deleted");
    }
  };

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setNewName(node.name);
                setRenameOpen(true);
              }}
            >
              <Pencil className="w-3 h-3 mr-2" />
              Rename
            </DropdownMenuItem>

            {node.type === "file" && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-3 h-3 mr-2" />
                Download
              </DropdownMenuItem>
            )}

            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-400"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {node.type === "folder" ? "folder" : "file"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {node.type === "folder" ? (
                <>
                  This will permanently delete the folder{" "}
                  <span className="font-semibold text-amber-300">
                    {node.name}
                  </span>{" "}
                  and all files and subfolders inside it. This action cannot be
                  undone.
                </>
              ) : (
                <>
                  This will permanently delete the file{" "}
                  <span className="font-semibold text-amber-300">
                    {node.name}
                  </span>
                  . This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Rename {node.type === "folder" ? "folder" : "file"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <Input
              ref={inputRef}
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRenameSubmit();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleRenameSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
