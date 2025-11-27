import React from "react";
import { Folder, FileText } from "lucide-react";

interface Props {
  type: "folder" | "file";
}

export const NodeIcon: React.FC<Props> = ({ type }) => {
  if (type === "folder") {
    return <Folder className="w-4 h-4 text-sky-400" />;
  }
  return <FileText className="w-4 h-4 text-emerald-400" />;
};
