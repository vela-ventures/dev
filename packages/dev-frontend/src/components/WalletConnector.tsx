import { ConnectKitButton } from "connectkit";
import { PlugIcon } from "lucide-react";
import { Button, Flex } from "theme-ui";

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
              <PlugIcon/>
              <div className="ml-2">Connect wallet</div>
            </Button>
          </Flex>
        )
      }
    </ConnectKitButton.Custom>
  );
};
