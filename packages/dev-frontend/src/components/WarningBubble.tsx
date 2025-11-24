import { Box } from "theme-ui";

import { TriangleAlertIcon } from "lucide-react";

export const WarningBubble: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",

      mb: [2, 3],
      p: 3,

      border: 1,
      borderRadius: "8px",
      borderColor: "warning",
      boxShadow: 2
      // bg: "rgba(46, 182, 234, 0.05)"
    }}
  >
    <div className="flex items-center">
      <TriangleAlertIcon/>
      <span className="ml-2">{children}</span>
    </div>
  </Box>
);
