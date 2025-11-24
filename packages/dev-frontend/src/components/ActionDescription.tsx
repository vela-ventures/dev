import { Box } from "theme-ui";

export const ActionDescription: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",

      mb: [2, 3],
      p: 3,

      border: 1,
      borderColor: "transparent"
    }}
  >
    <div className="flex items-center">
      <span>{children}</span>
    </div>
  </Box>
);

export const Amount: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="font-bold whitespace-nowrap">{children}</span>
);
