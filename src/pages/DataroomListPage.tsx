import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDataroom } from "@/state/useDataroom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Dataroom } from "@/state/dataroom-types";

export const DataroomListPage: React.FC = () => {
  const { state, dispatch } = useDataroom();
  const datarooms = Object.values(state.data.datarooms);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [renameTarget, setRenameTarget] = useState<Dataroom | null>(null);
  const [renameName, setRenameName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Dataroom | null>(null);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Please enter a name for the data room");
      return;
    }

    dispatch({ type: "CREATE_DATAROOM", payload: { name: trimmed } });
    toast.success("Data room created");

    setNewName("");
    setIsCreateOpen(false);
  };

  const openRename = (dr: Dataroom) => {
    setRenameTarget(dr);
    setRenameName(dr.name);
  };

  const handleRename = () => {
    if (!renameTarget) return;
    const trimmed = renameName.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty");
      return;
    }

    dispatch({
      type: "RENAME_DATAROOM",
      payload: { dataroomId: renameTarget.id, name: trimmed },
    });

    toast.success("Data room renamed");
    setRenameTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    dispatch({
      type: "DELETE_DATAROOM",
      payload: { dataroomId: deleteTarget.id },
    });

    toast.success(`Data room "${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Rooms</h1>
        <Button className="cursor-pointer" onClick={() => setIsCreateOpen(true)}>New data room</Button>
      </div>

      {datarooms.length === 0 ? (
        <div className="text-sm text-slate-400">
          No data rooms yet. Click <span className="font-semibold">New data room</span> to create one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {datarooms.map((dr) => (
            <div
              key={dr.id}
              className="rounded-lg border border-slate-700 bg-slate-900 p-4 hover:border-sky-500 hover:bg-slate-800 transition flex flex-col justify-between"
            >
              <Link
                to={`/dataroom/${dr.id}`}
                className="block flex-1"
              >
                <div className="font-semibold mb-1">{dr.name}</div>
                <div className="text-xs text-slate-400">
                  Created: {new Date(dr.createdAt).toLocaleString()}
                </div>
              </Link>

              <div className="mt-3 flex items-center justify-end gap-2 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => openRename(dr)}
                >
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                  onClick={() => setDeleteTarget(dr)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create data room</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="text-xs text-slate-300">
              Name
              <Input
                className="mt-1"
                placeholder="Acme Corp – Acquisition"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </label>
          </div>
          <DialogFooter className="mt-4">
            <Button className="cursor-pointer" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename data room</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="text-xs text-slate-300">
              New name
              <Input
                className="mt-1"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                autoFocus
              />
            </label>
          </div>
          <DialogFooter className="mt-4">
            <Button className="cursor-pointer" variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete data room</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-semibold text-amber-300">
                {deleteTarget?.name}
              </span>{" "}
              and all folders & files inside it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
