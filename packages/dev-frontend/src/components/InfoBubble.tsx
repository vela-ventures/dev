import { InfoIcon } from "lucide-react";

export const InfoBubble: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-around mb-2 md:mb-3 p-3 border rounded-lg border-accent shadow-sm bg-accent/5">
    <div className="flex items-center">
      <InfoIcon />
      <span className="ml-2">{children}</span>
    </div>
  </div>
);
