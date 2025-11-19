/** @jsxImportSource theme-ui */
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import {
  Box,
  Checkbox,
  Close,
  Heading,
  Image,
  Label,
  Link,
  Paragraph
} from "theme-ui";
import { useWizard } from "../../../Wizard/Context";
import { useBondView } from "../../context/BondViewContext";
import { Details } from "./Details";

const InformationContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { dispatchEvent } = useBondView();
  const handleDismiss = () => dispatchEvent("ABORT_PRESSED");

  return (
    <>
      <Heading as="h2" sx={{ pt: 2, pb: 3, px: 2 }}>
        <div className="flex justify-center">Bond LUSD</div>
        <Close
          onClick={handleDismiss}
          sx={{
            position: "absolute",
            right: "24px",
            top: "24px"
          }}
        />
      </Heading>

      <div className="flex justify-center">
        <Image src="./bonds/bond-info.png" sx={{ height: "200px" }} />
      </div>

      {children}
    </>
  );
};

export const Information: React.FC = () => {
  const hideMessageRef = useRef<HTMLInputElement>(null);

  const { go, back } = useWizard();

  const handleUnderstandPressed = () => {
    if (hideMessageRef?.current?.checked) {
      window.localStorage.setItem("LIQUITY.BOND_FAQ.VISISBLE", "true");
    }
    go && go(Details);
  };

  return (
    <InformationContainer>
      <Box sx={{ p: [2, 3] }}>
        <Paragraph sx={{ mt: 2 }}>
          Bonds accrue a virtual balance of boosted LUSD tokens (bLUSD) over time. At any time, the
          bonder may choose to claim their bLUSD in exchange for their LUSD, or cancel their bond to
          recover their deposited LUSD.
        </Paragraph>
        <Paragraph sx={{ mt: 3 }}>
          Please visit the&nbsp;
          <Link href="https://docs.chickenbonds.org/" target="_blank">
            docs
          </Link>
          &nbsp;to understand how bonds work.
        </Paragraph>
      </Box>

      <div className="flex">
        <div className="flex justify-end flex-col">
          <Label sx={{ fontSize: "14px" }}>
            <div className="flex">
              <Checkbox ref={hideMessageRef} />
              Don't show this message again
            </div>
          </Label>
        </div>
        <Button variant="cancel" onClick={back ? back : () => {}}>
          Back
        </Button>
        <Button onClick={handleUnderstandPressed}>Continue</Button>
      </div>
    </InformationContainer>
  );
};
