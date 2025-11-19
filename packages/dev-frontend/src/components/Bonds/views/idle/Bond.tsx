import { Image, ThemeUIStyleObject } from "theme-ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventType, HorizontalTimeline } from "../../../HorizontalTimeline";
import { Record } from "../../Record";
import { Actions } from "./actions/Actions";
import { BLusdAmmTokenIndex, Bond as BondType, SwapPressedPayload } from "../../context/transitions";
import { Label, SubLabel } from "../../../HorizontalTimeline";
import * as l from "../../lexicon";
import { statuses, useBondView } from "../../context/BondViewContext";
import { useBondAddresses } from "../../context/BondAddressesContext";
import { InfiniteEstimate } from "../InfiniteEstimation";

const getBondEvents = (bond: BondType): EventType[] => {
  const events = [
    {
      date: new Date(bond.startTime),
      label: (
        <>
          <Label description={l.BOND_CREATED.description}>{l.BOND_CREATED.term}</Label>
          <SubLabel>{`0.00 bLUSD`}</SubLabel>
        </>
      )
    },
    {
      date: new Date(bond.status === "PENDING" ? Date.now() : bond?.endTime ?? 0),
      label: (
        <>
          <Label
            description={
              bond.status === "PENDING"
                ? l.ACCRUED_AMOUNT.description
                : `The date you ${statuses[bond.status].toLowerCase()} your bond.`
            }
            style={{ fontWeight: 500 }}
          >
            {bond.status === "PENDING" ? l.ACCRUED_AMOUNT.term : statuses[bond.status]}
          </Label>
          <SubLabel style={{ fontWeight: 400 }}>
            {bond.status === "PENDING"
              ? `${bond.accrued.prettify(2)} bLUSD`
              : bond.status === "CLAIMED"
              ? `${bond?.claimedAmount?.prettify(2)} bLUSD`
              : ""}
          </SubLabel>
        </>
      ),
      isEndOfLife: true,
      isMilestone: bond.status !== "PENDING"
    }
  ];

  if (bond.status === "PENDING") {
    events.push({
      date: new Date(bond.breakEvenTime),
      label: (
        <>
          <Label description={l.BREAK_EVEN_TIME.description}>{l.BREAK_EVEN_TIME.term}</Label>
          <SubLabel>
            <InfiniteEstimate estimate={bond?.breakEvenAccrual}>
              {bond?.breakEvenAccrual?.prettify(2) ?? "?"} bLUSD
            </InfiniteEstimate>
          </SubLabel>
        </>
      )
    });

    events.push({
      date: new Date(bond.rebondTime),
      label: (
        <>
          <Label description={l.OPTIMUM_REBOND_TIME.description}>{l.OPTIMUM_REBOND_TIME.term}</Label>
          <SubLabel>
            <InfiniteEstimate estimate={bond?.rebondAccrual}>
              {bond?.rebondAccrual?.prettify(2) ?? "?"} bLUSD
            </InfiniteEstimate>
          </SubLabel>
        </>
      )
    });
  }
  return events;
};

type BondProps = { bond: BondType; style?: ThemeUIStyleObject };

export const Bond: React.FC<BondProps> = ({ bond, style }) => {
  const events = getBondEvents(bond);
  const { dispatchEvent } = useBondView();
  const { BOND_NFT_ADDRESS } = useBondAddresses();

  const handleSellBLusdPressed = () => {
    dispatchEvent("SWAP_PRESSED", { inputToken: BLusdAmmTokenIndex.BLUSD } as SwapPressedPayload);
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        gap: "12px",
        ...(style as React.CSSProperties)
      }}
    >
      <div
        className="flex shrink-0"
        style={{
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          borderRadius: "8.5px",
          border: "1px solid",
          borderColor: "var(--theme-ui-colors-muted)",
          background: "var(--theme-ui-colors-background)"
        }}
      >
        <Image
          sx={{ cursor: "pointer", minWidth: "150px" }}
          src={bond.tokenUri}
          alt="NFT image representation of your bond."
          onClick={() => {
            window.open(
              `https://looksrare.org/collections/${BOND_NFT_ADDRESS}/${bond.id}`,
              "_blank"
            );
          }}
        />
      </div>
      <Card style={{ borderRadius: 12, flexGrow: 1 }}>
        <div className="flex flex-col p-2 md:p-3">
          <HorizontalTimeline
            style={{ fontSize: "14.5px", justifyContent: "center", paddingTop: "0.5rem", marginLeft: "0.75rem", marginRight: "0.75rem" }}
            events={events}
          />

          <div className="flex mt-4 pl-3 justify-end" style={{ justifyContent: "space-between", gap: "12px" }}>
            <div
              className="flex justify-start grow items-center"
              style={{
                gap: "0 28px",
                fontSize: "14.5px"
              }}
            >
              <Record lexicon={l.BOND_DEPOSIT} value={bond.deposit.prettify(2)} type="LUSD" />
              {bond.status === "PENDING" && (
                <Record
                  lexicon={l.MARKET_VALUE}
                  value={bond?.marketValue?.prettify(2) ?? "0"}
                  type="LUSD"
                />
              )}
            </div>
            {bond.status === "PENDING" && <Actions bondId={bond.id} />}
            {bond.status !== "PENDING" && bond.status === "CLAIMED" && (
              <Button variant="outline" style={{ height: "44px" }} onClick={handleSellBLusdPressed}>
                Sell bLUSD
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
