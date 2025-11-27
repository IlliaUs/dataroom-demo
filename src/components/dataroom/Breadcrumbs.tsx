import React from "react";
import { useDataroom } from "@/state/useDataroom";

interface FolderCrumb {
  id: string;
  name: string;
}

interface Props {
  path: FolderCrumb[];
}

export const Breadcrumbs: React.FC<Props> = ({ path }) => {
  const { dispatch } = useDataroom();

  if (!path.length) {
    return (
      <nav className="text-xs text-slate-400 mt-1">
        <span>Root</span>
      </nav>
    );
  }

  const handleClick = (id: string) => {
    dispatch({
      type: "SET_CURRENT_FOLDER",
      payload: { folderId: id },
    });
  };

  return (
    <nav className="text-xs text-slate-400 mt-1 flex items-center flex-wrap gap-1">
      {path.map((crumb, index) => {
        const isLast = index === path.length - 1;
        return (
          <React.Fragment key={crumb.id}>
            {index > 0 && <span className="text-slate-500">/</span>}
            {isLast ? (
              <span className="text-slate-200">{crumb.name}</span>
            ) : (
              <button
                type="button"
                className="hover:text-slate-200 underline-offset-2 hover:underline"
                onClick={() => handleClick(crumb.id)}
              >
                {crumb.name}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
