import { ConnectKitButton } from "connectkit";
import { Box, Flex } from "theme-ui";
import { Button } from "@/components/ui/button";
import { Icon } from "./Icon";

type WalletConnectorProps = React.PropsWithChildren<{
  loader?: React.ReactNode;
}>;

export const WalletConnector: React.FC<WalletConnectorProps> = ({ children }) => {
  return (
    <ConnectKitButton.Custom>
      {connectKit =>
        connectKit.isConnected ? (
          children
        ) : (
          <Flex sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
            <Button onClick={connectKit.show}>
              <Icon name="plug" size="lg" />
              <Box sx={{ ml: 2 }}>Connect wallet</Box>
            </Button>
          </Flex>
        )
      }
    </ConnectKitButton.Custom>
  );
};
