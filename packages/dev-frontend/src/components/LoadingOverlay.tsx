import React from "react";
import { Spinner } from "./ui/spinner";

export const LoadingOverlay: React.FC = () => (
  <div className="p-3.5 flex justify-end">
    <Spinner className="size-7 text-foreground" />
  </div>
);
