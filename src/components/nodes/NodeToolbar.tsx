import React, { useRef, useState } from "react";
import { FolderPlus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDataroom } from "@/state/useDataroom";
import { saveFile } from "@/lib/fileStorage";
import { toast } from "sonner";
import { isPdfFile } from "@/lib/fileTypeCheck";

interface NodeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const { state, dispatch } = useDataroom();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolderSubmit = () => {
    const { currentDataroomId, currentFolderId } = state.ui;
    if (!currentDataroomId || !currentFolderId) {
      alert("No data room or folder selected");
      return;
    }

    const name = newFolderName.trim();
    if (!name) return;

    dispatch({
      type: "CREATE_FOLDER",
      payload: {
        dataroomId: currentDataroomId,
        parentId: currentFolderId,
        name,
      },
    });

    setNewFolderName("");
    setCreateOpen(false);
    toast.success("Folder created");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { currentDataroomId, currentFolderId } = state.ui;

    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    if (!currentDataroomId || !currentFolderId) {
      toast.error("No data room or folder selected.");
      event.target.value = "";
      return;
    }

    const files = Array.from(fileList);

    const accepted: File[] = [];
    const rejected: File[] = [];

    for (const file of files) {
      if (isPdfFile(file)) {
        accepted.push(file);
      } else {
        rejected.push(file);
      }
    }

    for (const file of accepted) {
      const storageKey = saveFile(file);

      dispatch({
        type: "UPLOAD_FILE",
        payload: {
          dataroomId: currentDataroomId,
          parentId: currentFolderId,
          name: file.name,
          mimeType: file.type || "application/pdf",
          size: file.size,
          storageKey,
        },
      });
    }

    if (accepted.length === 0 && rejected.length > 0) {
      if (rejected.length === 1) {
        toast.error(
          `File "${rejected[0].name}" is not a PDF and was not uploaded.`
        );
      } else {
        toast.error(
          `${rejected.length} files were not uploaded because only PDF is supported in this demo.`
        );
      }
    }

    if (accepted.length > 0 && rejected.length === 0) {
      if (accepted.length === 1) {
        toast.success(
          `Uploaded "${accepted[0].name}". Note: file content is only available until you refresh this page in this demo.`
        );
      } else {
        toast.success(
          `Uploaded ${accepted.length} files. Note: file content is only available until you refresh this page in this demo.`
        );
      }
    }

    if (accepted.length > 0 && rejected.length > 0) {
      toast(
        `${accepted.length} file(s) uploaded, ${rejected.length} file(s) were not uploaded because only PDF is supported in this demo. Uploaded file content is only available until you refresh this page.`
      );
    }

    event.target.value = "";
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-sky-600 hover:bg-sky-500 text-white"
            onClick={() => setCreateOpen(true)}
          >
            <FolderPlus className="w-4 h-4 mr-1" />
            New folder
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-100"
            onClick={handleUploadClick}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload file
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              className="pl-7 h-8 text-xs bg-slate-900 border-slate-700"
              placeholder="Search in this folder"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <Input
              autoFocus
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateFolderSubmit();
                }
              }}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleCreateFolderSubmit}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
