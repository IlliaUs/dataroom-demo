export type ID = string;

export interface Dataroom {
  id: ID;
  name: string;
  rootFolderId: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: ID;
  dataroomId: ID;
  name: string;
  parentId: ID | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileNode {
  id: ID;
  dataroomId: ID;
  parentId: ID;
  name: string;
  mimeType: string;
  size: number;
  storageKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataState {
  datarooms: Record<ID, Dataroom>;
  folders: Record<ID, Folder>;
  files: Record<ID, FileNode>;
}

export interface UIState {
  currentDataroomId: ID | null;
  currentFolderId: ID | null;
}

export interface AppState {
  data: DataState;
  ui: UIState;
}

export type Action =
  | {
      type: "SET_CURRENT_DATAROOM";
      payload: { dataroomId: ID | null };
    }
  | {
      type: "SET_CURRENT_FOLDER";
      payload: { folderId: ID | null };
    }
  | {
      type: "CREATE_DATAROOM";
      payload: { name: string };
    }
  | {
      type: "RENAME_DATAROOM";
      payload: { dataroomId: ID; name: string };
    }
  | {
      type: "DELETE_DATAROOM";
      payload: { dataroomId: ID };
    }
  | {
      type: "CREATE_FOLDER";
      payload: { dataroomId: ID; parentId: ID; name: string };
    }
  | {
      type: "UPLOAD_FILE";
      payload: {
        dataroomId: ID;
        parentId: ID;
        name: string;
        mimeType: string;
        size: number;
        storageKey: string;
      };
    }
  | {
      type: "DELETE_FILE";
      payload: { fileId: ID };
    }
  | {
      type: "DELETE_FOLDER";
      payload: { folderId: ID };
    }
  | {
      type: "RENAME_FILE";
      payload: { fileId: ID; name: string };
    }
  | {
      type: "RENAME_FOLDER";
      payload: { folderId: ID; name: string };
    };
