import React, { useMemo } from "react";
import { FolderTreeNode } from "./FolderTreeNode";
import { useDataroom } from "@/state/useDataroom";
import type { Folder } from "@/state/dataroom-types";

export const FolderTree: React.FC = () => {
  const { state, dispatch } = useDataroom();
  const { currentDataroomId, currentFolderId } = state.ui;

  const folders = useMemo(
    () =>
      Object.values(state.data.folders).filter(
        (f) => f.dataroomId === currentDataroomId
      ),
    [state.data.folders, currentDataroomId]
  );

  if (!currentDataroomId) {
    return <div className="text-xs text-slate-500 px-2">No data room selected</div>;
  }

  const root = folders.find((f) => f.parentId === null);
  if (!root) {
    return <div className="text-xs text-slate-500 px-2">No folders yet</div>;
  }

  const renderFolder = (folder: Folder, level: number) => {
    const children = folders.filter((f) => f.parentId === folder.id);

    return (
      <React.Fragment key={folder.id}>
        <FolderTreeNode
          name={folder.name}
          level={level}
          isActive={folder.id === currentFolderId}
          onClick={() =>
            dispatch({
              type: "SET_CURRENT_FOLDER",
              payload: { folderId: folder.id },
            })
          }
        />
        {children.map((child) => renderFolder(child, level + 1))}
      </React.Fragment>
    );
  };

  return <div className="space-y-1">{renderFolder(root, 0)}</div>;
};
