import React from "react";
import { Folder } from "lucide-react";

interface Props {
  name: string;
  level: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const FolderTreeNode: React.FC<Props> = ({
  name,
  level,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={[
        "flex items-center w-full text-left text-xs px-2 py-1.5 rounded-md",
        isActive ? "bg-slate-800 text-slate-100" : "hover:bg-slate-800/70",
      ].join(" ")}
      style={{ paddingLeft: 8 + level * 12 }}
      onClick={onClick}
    >
      <Folder className="w-3 h-3 mr-2 text-slate-400" />
      <span className="truncate">{name}</span>
    </button>
  );
};
