import React from "react";
import { FolderTree } from "./FolderTree";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800 text-sm font-semibold">
        Folders
      </div>
      <div className="flex-1 overflow-auto px-2 py-2">
        <FolderTree />
      </div>
    </div>
  );
};