import { TriangleAlertIcon } from "lucide-react";

export const ErrorDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-around mb-2 md:mb-3 p-3 border rounded-lg border-destructive shadow-sm bg-destructive/5">
    <div className="flex items-center">
      <TriangleAlertIcon />
      <span className="ml-2">{children}</span>
    </div>
  </div>
);
