import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataroom } from "@/state/useDataroom";
import { DataroomLayout } from "@/layouts/DataroomLayout";
import type { Folder } from "@/state/dataroom-types";

interface FolderCrumb {
  id: string;
  name: string;
}

function buildFolderPath(
  folders: Record<string, Folder>,
  rootFolderId: string,
  currentFolderId: string
): FolderCrumb[] {
  const path: FolderCrumb[] = [];
  let current: Folder | undefined = folders[currentFolderId];

  while (current) {
    path.push({ id: current.id, name: current.name });
    if (current.parentId === null || current.id === rootFolderId) break;
    current = current.parentId ? folders[current.parentId] : undefined;
  }

  return path.reverse();
}

export const DataroomPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useDataroom();

  const dataroom = id
    ? state.data.datarooms[id] ?? null
    : null;

  useEffect(() => {
    if (!dataroom) return;

    dispatch({
      type: "SET_CURRENT_DATAROOM",
      payload: { dataroomId: dataroom.id },
    });

    if (
      !state.ui.currentFolderId ||
      state.ui.currentDataroomId !== dataroom.id
    ) {
      dispatch({
        type: "SET_CURRENT_FOLDER",
        payload: { folderId: dataroom.rootFolderId },
      });
    }
  }, [dataroom, dispatch, state.ui.currentDataroomId, state.ui.currentFolderId]);

  const currentFolderId =
    dataroom && state.ui.currentFolderId
      ? state.ui.currentFolderId
      : dataroom
      ? dataroom.rootFolderId
      : null;

  const folderPath = useMemo(() => {
    if (!dataroom || !currentFolderId) return [];
    return buildFolderPath(
      state.data.folders,
      dataroom.rootFolderId,
      currentFolderId
    );
  }, [dataroom, currentFolderId, state.data.folders]);

  if (!dataroom) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
        <p>Data room not found.</p>
      </div>
    );
  }

  return (
    <DataroomLayout
      dataroomName={dataroom.name}
      folderPath={folderPath}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};
