/** @jsxImportSource theme-ui */
import { Decimal } from "@liquity/lib-base";
import React from "react";
import { Box, Card, Grid, Heading, Text } from "theme-ui";
import { InfoIcon } from "../InfoIcon";
import { Link } from "../Link";
import { Button } from "../ui/button";
import { useBondView } from "./context/BondViewContext";
import * as lexicon from "./lexicon";
import { Empty } from "./views/idle/Empty";
import { InfiniteEstimate } from "./views/InfiniteEstimation";

const {
  BONDS,
  BOND_DEPOSIT: BOND_AMOUNT,
  ACCRUED_AMOUNT,
  MARKET_VALUE,
  OPTIMUM_REBOND_TIME,
  BREAK_EVEN_TIME
} = lexicon;

const LineSegment: React.FC = () => (
  <div
    className="flex w-full"
    style={{
      borderTop: "1px dotted gray",
      marginTop: "-20px",
      marginBottom: 0
    }}
  />
);

const formatDays = (days: number) =>
  days < 0
    ? "Elapsed"
    : days === 0
    ? "Now"
    : parseFloat(days.toFixed(1)) < 1
    ? `${days.toFixed(1)} days`
    : days > 10000
    ? Decimal.INFINITY.toString()
    : `${days.toFixed(0)} days`;

const Line = (columns: number) =>
  Array.from(Array(columns)).map((_, idx) => <LineSegment key={idx} />);

const columns = 5;

export const BondsTable: React.FC = () => {
  const { bonds, hasLoaded } = useBondView();

  if (!hasLoaded) return null;

  const pendingBonds = bonds ? bonds.filter(bond => bond.status === "PENDING") : [];
  const hasBonds = pendingBonds.length > 0;
  return (
    <Card>
      <Heading>
        <div className="flex">
          Pending bonds{" "}
          <InfoIcon
            placement="left"
            tooltip={<Card variant="tooltip">{BONDS.description}</Card>}
          />
        </div>
      </Heading>

      <Box sx={{ p: [2, 3] }}>
        {!hasBonds && <Empty />}
        {hasBonds && (
          <Grid
            gap="12px 0px"
            columns={[columns, "1fr 1fr 1.1fr 1.3fr 1fr"]}
            sx={{ alignItems: "center", justifyItems: "center", alignContent: "center" }}
          >
            <Text sx={{ fontWeight: "bold" }}>
              {BOND_AMOUNT.term}{" "}
              <InfoIcon
                tooltip={<Card variant="tooltip">{BOND_AMOUNT.description}</Card>}
              />
            </Text>
            <Text sx={{ fontWeight: "bold" }}>
              {ACCRUED_AMOUNT.term}{" "}
              <InfoIcon
                tooltip={<Card variant="tooltip">{ACCRUED_AMOUNT.description}</Card>}
              />
            </Text>
            <Text sx={{ fontWeight: "bold" }}>
              {MARKET_VALUE.term}{" "}
              <InfoIcon
                tooltip={<Card variant="tooltip">{MARKET_VALUE.description}</Card>}
              />
            </Text>
            <Text sx={{ fontWeight: "bold" }}>
              {BREAK_EVEN_TIME.term}{" "}
              <InfoIcon
                tooltip={<Card variant="tooltip">{BREAK_EVEN_TIME.description}</Card>}
              />
            </Text>
            <Text sx={{ fontWeight: "bold" }}>
              {OPTIMUM_REBOND_TIME.term}{" "}
              <InfoIcon
                tooltip={<Card variant="tooltip">{OPTIMUM_REBOND_TIME.description}</Card>}
              />
            </Text>
            {Line(5)}

            {pendingBonds.map((bond, idx) => {
              const breakEvenDays = formatDays(
                (bond.breakEvenTime.getTime() - Date.now()) / 1000 / 60 / 60 / 24
              );
              const rebondDays = formatDays(
                (bond.rebondTime.getTime() - Date.now()) / 1000 / 60 / 60 / 24
              );
              return (
                <React.Fragment key={idx}>
                  <Text>{bond.deposit.shorten()} LUSD</Text>
                  <Text>{bond.accrued.shorten()} bLUSD</Text>
                  <Text>{bond.marketValue.shorten()} LUSD</Text>
                  <Text>
                    <InfiniteEstimate estimate={breakEvenDays} />
                  </Text>
                  <Text>
                    <InfiniteEstimate estimate={rebondDays} />
                  </Text>
                  {Line(5)}
                </React.Fragment>
              );
            })}
          </Grid>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Link to="/bonds/pending" m={0} p={0}>
            <Button>Go to bonds</Button>
          </Link>
        </div>
      </Box>
    </Card>
  );
};
