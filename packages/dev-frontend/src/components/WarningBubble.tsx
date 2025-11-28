import { TriangleAlertIcon } from "lucide-react";

export const WarningBubble: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-around mb-2 md:mb-3 p-3 border rounded-lg border-yellow-500 shadow-sm">
    <div className="flex items-center">
      <TriangleAlertIcon />
      <span className="ml-2">{children}</span>
    </div>
  </div>
);
