import type {
  Action,
  AppState,
  Dataroom,
  DataState,
  FileNode,
  Folder,
  ID,
} from "./dataroom-types";

const createId = (prefix: string): ID =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(
    36
  )}`;

const initialData: DataState = {
  datarooms: {},
  folders: {},
  files: {},
};

function collectFolderSubtreeIds(
  folders: Record<ID, Folder>,
  rootFolderId: ID
): ID[] {
  const result: ID[] = [];
  const stack: ID[] = [rootFolderId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    result.push(currentId);
    const children = Object.values(folders).filter(
      (f) => f.parentId === currentId
    );
    children.forEach((child) => stack.push(child.id));
  }

  return result;
}

function makeUniqueName(existingNames: string[], desiredName: string): string {
  if (!existingNames.includes(desiredName)) return desiredName;

  const dotIndex = desiredName.lastIndexOf(".");
  const base = dotIndex > 0 ? desiredName.slice(0, dotIndex) : desiredName;
  const ext = dotIndex > 0 ? desiredName.slice(dotIndex) : "";

  let counter = 1;
  let candidate = `${base} (${counter})${ext}`;
  while (existingNames.includes(candidate)) {
    counter += 1;
    candidate = `${base} (${counter})${ext}`;
  }
  return candidate;
}

export const initialState: AppState = {
  data: initialData,
  ui: {
    currentDataroomId: null,
    currentFolderId: null,
  },
};

export function dataroomReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CREATE_DATAROOM": {
      const { name } = action.payload;
      const now = new Date().toISOString();

      const dataroomId = createId("dr");
      const rootFolderId = createId("folder-root");

      const newDataroom = {
        id: dataroomId,
        name,
        rootFolderId,
        createdAt: now,
        updatedAt: now,
      };

      const rootFolder: Folder = {
        id: rootFolderId,
        dataroomId,
        name: "Root",
        parentId: null,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...state,
        data: {
          ...state.data,
          datarooms: {
            ...state.data.datarooms,
            [dataroomId]: newDataroom,
          },
          folders: {
            ...state.data.folders,
            [rootFolderId]: rootFolder,
          },
        },
        ui: {
          ...state.ui,
          currentDataroomId: dataroomId,
          currentFolderId: rootFolderId,
        },
      };
    }

    case "RENAME_DATAROOM": {
      const { dataroomId, name } = action.payload;
      const dr = state.data.datarooms[dataroomId];
      if (!dr) return state;

      const now = new Date().toISOString();

      return {
        ...state,
        data: {
          ...state.data,
          datarooms: {
            ...state.data.datarooms,
            [dataroomId]: {
              ...dr,
              name,
              updatedAt: now,
            },
          },
        },
      };
    }

    case "DELETE_DATAROOM": {
      const { dataroomId } = action.payload;
      const dr = state.data.datarooms[dataroomId];
      if (!dr) return state;

      const folderIdsToDelete = Object.values(state.data.folders)
        .filter((f) => f.dataroomId === dataroomId)
        .map((f) => f.id);

      const fileIdsToDelete = Object.values(state.data.files)
        .filter((f) => f.dataroomId === dataroomId)
        .map((f) => f.id);

      const newFolders: Record<ID, Folder> = { ...state.data.folders };
      folderIdsToDelete.forEach((id) => {
        delete newFolders[id];
      });

      const newFiles: Record<ID, FileNode> = { ...state.data.files };
      fileIdsToDelete.forEach((id) => {
        delete newFiles[id];
      });

      const newDatarooms: Record<ID, Dataroom> = {
        ...state.data.datarooms,
      };
      delete newDatarooms[dataroomId];

      const isCurrentDrDeleted = state.ui.currentDataroomId === dataroomId;
      const newCurrentFolderId = isCurrentDrDeleted
        ? null
        : state.ui.currentFolderId;

      return {
        ...state,
        data: {
          ...state.data,
          datarooms: newDatarooms,
          folders: newFolders,
          files: newFiles,
        },
        ui: {
          ...state.ui,
          currentDataroomId: isCurrentDrDeleted
            ? null
            : state.ui.currentDataroomId,
          currentFolderId: newCurrentFolderId,
        },
      };
    }
    case "SET_CURRENT_FOLDER": {
      const { folderId } = action.payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          currentFolderId: folderId,
        },
      };
    }
    case "CREATE_FOLDER": {
      const { dataroomId, parentId, name } = action.payload;
      const id = createId("folder");
      const now = new Date().toISOString();

      const newFolder: Folder = {
        id,
        dataroomId,
        parentId,
        name,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...state,
        data: {
          ...state.data,
          folders: {
            ...state.data.folders,
            [id]: newFolder,
          },
          datarooms: {
            ...state.data.datarooms,
            [dataroomId]: {
              ...state.data.datarooms[dataroomId],
              updatedAt: now,
            },
          },
        },
      };
    }

    case "UPLOAD_FILE": {
      const { dataroomId, parentId, name, mimeType, size, storageKey } =
        action.payload;
      const id = createId("file");
      const now = new Date().toISOString();

      const siblings = Object.values(state.data.files).filter(
        (f) => f.dataroomId === dataroomId && f.parentId === parentId
      );
      const existingNames = siblings.map((f) => f.name);
      const finalName = makeUniqueName(existingNames, name);

      const newFile: FileNode = {
        id,
        dataroomId,
        parentId,
        name: finalName,
        mimeType,
        size,
        storageKey,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...state,
        data: {
          ...state.data,
          files: {
            ...state.data.files,
            [id]: newFile,
          },
          datarooms: {
            ...state.data.datarooms,
            [dataroomId]: {
              ...state.data.datarooms[dataroomId],
              updatedAt: now,
            },
          },
        },
      };
    }
    case "RENAME_FILE": {
      const { fileId, name } = action.payload;
      const file = state.data.files[fileId];
      if (!file) return state;

      const siblings = Object.values(state.data.files).filter(
        (f) =>
          f.dataroomId === file.dataroomId &&
          f.parentId === file.parentId &&
          f.id !== file.id
      );
      const existingNames = siblings.map((f) => f.name);
      const finalName = makeUniqueName(existingNames, name);

      const now = new Date().toISOString();

      return {
        ...state,
        data: {
          ...state.data,
          files: {
            ...state.data.files,
            [fileId]: {
              ...file,
              name: finalName,
              updatedAt: now,
            },
          },
        },
      };
    }
    case "RENAME_FOLDER": {
      const { folderId, name } = action.payload;
      const folder = state.data.folders[folderId];
      if (!folder) return state;

      const siblings = Object.values(state.data.folders).filter(
        (f) =>
          f.dataroomId === folder.dataroomId &&
          f.parentId === folder.parentId &&
          f.id !== folder.id
      );
      const existingNames = siblings.map((f) => f.name);
      const finalName = makeUniqueName(existingNames, name);

      const now = new Date().toISOString();

      return {
        ...state,
        data: {
          ...state.data,
          folders: {
            ...state.data.folders,
            [folderId]: {
              ...folder,
              name: finalName,
              updatedAt: now,
            },
          },
        },
      };
    }
    case "DELETE_FILE": {
      const { fileId } = action.payload;
      const file = state.data.files[fileId];
      if (!file) return state;

      const newFiles = { ...state.data.files };
      delete newFiles[fileId];

      const dr = state.data.datarooms[file.dataroomId];
      const now = new Date().toISOString();

      return {
        ...state,
        data: {
          ...state.data,
          files: newFiles,
          datarooms: {
            ...state.data.datarooms,
            [dr.id]: {
              ...dr,
              updatedAt: now,
            },
          },
        },
      };
    }

    case "DELETE_FOLDER": {
      const { folderId } = action.payload;
      const folder = state.data.folders[folderId];
      if (!folder) return state;

      const dataroom = state.data.datarooms[folder.dataroomId];
      const now = new Date().toISOString();

      if (dataroom.rootFolderId === folder.id) {
        console.warn("Cannot delete root folder of dataroom");
        return state;
      }

      const folderIdsToDelete = collectFolderSubtreeIds(
        state.data.folders,
        folderId
      );

      const fileIdsToDelete = Object.values(state.data.files)
        .filter((f) => folderIdsToDelete.includes(f.parentId))
        .map((f) => f.id);

      const newFolders: Record<ID, Folder> = { ...state.data.folders };
      folderIdsToDelete.forEach((id) => {
        delete newFolders[id];
      });

      const newFiles: Record<ID, FileNode> = { ...state.data.files };
      fileIdsToDelete.forEach((id) => {
        delete newFiles[id];
      });

      let newCurrentFolderId = state.ui.currentFolderId;
      if (
        newCurrentFolderId &&
        folderIdsToDelete.includes(newCurrentFolderId)
      ) {
        newCurrentFolderId = folder.parentId ?? dataroom.rootFolderId;
      }

      return {
        ...state,
        data: {
          ...state.data,
          folders: newFolders,
          files: newFiles,
          datarooms: {
            ...state.data.datarooms,
            [dataroom.id]: {
              ...dataroom,
              updatedAt: now,
            },
          },
        },
        ui: {
          ...state.ui,
          currentFolderId: newCurrentFolderId,
        },
      };
    }
    default:
      return state;
  }
}
