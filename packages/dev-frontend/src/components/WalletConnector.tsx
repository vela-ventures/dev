import { ConnectKitButton } from "connectkit";
import { PlugIcon } from "lucide-react";
import { Button } from "./ui/button";

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
          <div className="h-screen flex justify-center items-center">
            <Button onClick={connectKit.show}>
              <PlugIcon/> Connect wallet
            </Button>
          </div>
        )
      }
    </ConnectKitButton.Custom>
  );
};
