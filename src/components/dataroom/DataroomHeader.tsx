import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { ArrowLeft } from "lucide-react";

interface FolderCrumb {
  id: string;
  name: string;
}

interface Props {
  dataroomName: string;
  folderPath: FolderCrumb[];
}

export const DataroomHeader: React.FC<Props> = ({
  dataroomName,
  folderPath,
}) => {
  return (
    <header className="border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/datarooms"
            className="inline-flex items-center text-[11px] uppercase tracking-wide text-slate-400 hover:text-slate-100 mb-1"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            All data rooms
          </Link>

          <h1 className="text-lg font-semibold">{dataroomName}</h1>
          <Breadcrumbs path={folderPath} />

          <p className="mt-3 text-[12px] text-slate-400 max-w-md leading-relaxed">
            This demo preserves the folder structure between sessions, but
            uploaded file contents are only available during your current
            browser session and will not persist after a refresh.
          </p>
        </div>

        <div className="text-xs text-slate-400">Demo User</div>
      </div>
    </header>
  );
};
