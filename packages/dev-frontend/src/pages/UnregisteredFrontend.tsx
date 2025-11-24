import { Box, Paragraph } from "theme-ui";

import { TriangleAlertIcon } from "lucide-react";
import { useLiquity } from "../hooks/LiquityContext";
import { shortenAddress } from "../utils/shortenAddress";

export const UnregisteredFrontend: React.FC = () => {
  const {
    config: { frontendTag }
  } = useLiquity();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",

        m: 3,
        p: 3,
        maxWidth: "500px",

        border: 1,
        borderRadius: "8px",
        borderColor: "warning",
        boxShadow: 2
      }}
    >
      <div className="flex items-center mx-3 mb-2">
        <TriangleAlertIcon/>
        <h1 className="ml-3 text-lg font-semibold">Frontend not yet registered</h1>
      </div>

      <Paragraph sx={{ fontSize: 2 }}>
        If you're the operator of this frontend, please select <b>{shortenAddress(frontendTag)}</b>{" "}
        in your wallet to proceed with the registration.
      </Paragraph>
    </Box>
  );
};
