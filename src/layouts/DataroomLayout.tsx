import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { DataroomHeader } from "@/components/dataroom/DataroomHeader";
import { NodeToolbar } from "@/components/nodes/NodeToolbar";
import { NodeTable } from "@/components/nodes/NodeTable";

interface FolderCrumb {
  id: string;
  name: string;
}

interface DataroomLayoutProps {
  dataroomName: string;
  folderPath: FolderCrumb[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const DataroomLayout: React.FC<DataroomLayoutProps> = ({
  dataroomName,
  folderPath,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <DataroomHeader dataroomName={dataroomName} folderPath={folderPath} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60">
          <Sidebar />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-slate-800 px-6 py-3">
            <NodeToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <div className="flex-1 overflow-auto px-6 py-4">
            <NodeTable searchTerm={searchTerm} />
          </div>
        </main>
      </div>
    </div>
  );
};
