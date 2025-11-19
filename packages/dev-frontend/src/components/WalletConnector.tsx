import { ConnectKitButton } from "connectkit";
import { Box } from "theme-ui";
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
          <div className="flex h-screen justify-center items-center">
            <Button onClick={connectKit.show}>
              <Icon name="plug" size="lg" />
              <Box sx={{ ml: 2 }}>Connect wallet</Box>
            </Button>
          </div>
        )
      }
    </ConnectKitButton.Custom>
  );
};
