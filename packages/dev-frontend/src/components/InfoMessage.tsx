import { Box } from "theme-ui";

import { InfoIcon } from "lucide-react";

type InfoMessageProps = React.PropsWithChildren<{
  title: string;
  icon?: React.ReactNode;
}>;

export const InfoMessage: React.FC<InfoMessageProps> = ({ title, children, icon }) => (
  <Box sx={{ mx: 1, mb: 3 }}>
    <div className="flex items-center mb-2.5">
      <Box sx={{ mr: "12px", fontSize: "20px" }}>{icon || <InfoIcon/>}</Box>

      <h3 className="text-base font-semibold">{title}</h3>
    </div>

    <span className="text-base">{children}</span>
  </Box>
);
