import { Box, Flex, Text } from "theme-ui";

import { InfoIcon } from "lucide-react";

export const InfoBubble: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",

      mb: [2, 3],
      p: 3,

      border: 1,
      borderRadius: "8px",
      borderColor: "accent",
      boxShadow: 2,
      bg: "rgba(46, 182, 234, 0.05)"
    }}
  >
    <Flex sx={{ alignItems: "center" }}>
      <InfoIcon/>
      <Text sx={{ ml: 2 }}>{children}</Text>
    </Flex>
  </Box>
);
