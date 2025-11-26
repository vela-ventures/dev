import React, { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

import {
  CRITICAL_COLLATERAL_RATIO,
  Decimal,
  MINIMUM_COLLATERAL_RATIO,
  Percent,
  UserTrove
} from "@liquity/lib-base";
import { BlockPolledLiquityStoreState } from "@liquity/lib-ethers";
import { useLiquitySelector } from "@liquity/lib-react";

import { useLiquity } from "../hooks/LiquityContext";
import { COIN } from "../strings";
import { shortenAddress } from "../utils/shortenAddress";

import { ChevronLeftIcon, ChevronRightIcon, ClipboardCheckIcon, ClipboardIcon, RotateCwIcon, Trash2Icon } from "lucide-react";
import { Abbreviation } from "./Abbreviation";
import { Tooltip } from "./Tooltip";
import { Transaction } from "./Transaction";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

const rowHeight = "40px";

const liquidatableInNormalMode = (trove: UserTrove, price: Decimal) =>
  [trove.collateralRatioIsBelowMinimum(price), "Collateral ratio not low enough"] as const;

const liquidatableInRecoveryMode = (
  trove: UserTrove,
  price: Decimal,
  totalCollateralRatio: Decimal,
  lusdInStabilityPool: Decimal
) => {
  const collateralRatio = trove.collateralRatio(price);

  if (collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) && collateralRatio.lt(totalCollateralRatio)) {
    return [
      trove.debt.lte(lusdInStabilityPool),
      "There's not enough LUSD in the Stability pool to cover the debt"
    ] as const;
  } else {
    return liquidatableInNormalMode(trove, price);
  }
};

type RiskyTrovesProps = {
  pageSize: number;
};

const select = ({
  numberOfTroves,
  price,
  total,
  lusdInStabilityPool,
  blockTag
}: BlockPolledLiquityStoreState) => ({
  numberOfTroves,
  price,
  recoveryMode: total.collateralRatioIsBelowCritical(price),
  totalCollateralRatio: total.collateralRatio(price),
  lusdInStabilityPool,
  blockTag
});

export const RiskyTroves: React.FC<RiskyTrovesProps> = ({ pageSize }) => {
  const {
    blockTag,
    numberOfTroves,
    recoveryMode,
    totalCollateralRatio,
    lusdInStabilityPool,
    price
  } = useLiquitySelector(select);
  const { liquity } = useLiquity();

  const [loading, setLoading] = useState(true);
  const [troves, setTroves] = useState<UserTrove[]>();

  const [reload, setReload] = useState({});
  const forceReload = useCallback(() => setReload({}), []);

  const [page, setPage] = useState(0);
  const numberOfPages = Math.ceil(numberOfTroves / pageSize) || 1;
  const clampedPage = Math.min(page, numberOfPages - 1);

  const nextPage = () => {
    if (clampedPage < numberOfPages - 1) {
      setPage(clampedPage + 1);
    }
  };

  const previousPage = () => {
    if (clampedPage > 0) {
      setPage(clampedPage - 1);
    }
  };

  useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage);
    }
  }, [page, clampedPage]);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    liquity
      .getTroves(
        {
          first: pageSize,
          sortedBy: "ascendingCollateralRatio",
          startingAt: clampedPage * pageSize
        },
        { blockTag }
      )
      .then(troves => {
        if (mounted) {
          setTroves(troves);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
    // Omit blockTag from deps on purpose
    // eslint-disable-next-line
  }, [liquity, clampedPage, pageSize, reload]);

  useEffect(() => {
    forceReload();
  }, [forceReload, numberOfTroves]);

  const [copied, setCopied] = useState<string>();

  useEffect(() => {
    if (copied !== undefined) {
      let cancelled = false;

      setTimeout(() => {
        if (!cancelled) {
          setCopied(undefined);
        }
      }, 2000);

      return () => {
        cancelled = true;
      };
    }
  }, [copied]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg font-semibold flex justify-between items-center p-4 pb-0">
            <Abbreviation short="Troves">Risky Vaults</Abbreviation>

            <div className="flex items-center">
              {numberOfTroves !== 0 && (
                <>
                  <Abbreviation
                    short={`page ${clampedPage + 1} / ${numberOfPages}`}
                    sx={{ mr: [0, 3], fontWeight: "body", fontSize: [1, 2], letterSpacing: [-1, 0] }}
                  >
                    {clampedPage * pageSize + 1}-{Math.min((clampedPage + 1) * pageSize, numberOfTroves)}{" "}
                    of {numberOfTroves}
                  </Abbreviation>

                  <Button variant="ghost" onClick={previousPage} disabled={clampedPage <= 0}>
                    <ChevronLeftIcon/>
                  </Button>

                  <Button variant="ghost" onClick={nextPage} disabled={clampedPage >= numberOfPages - 1}
                  >
                    <ChevronRightIcon/>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                className="ml-0 md:ml-3"
                onClick={forceReload}
                disabled={loading}
              >
                {loading ? <Spinner /> : <RotateCwIcon />}
              </Button>
            </div>
          </h1>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!troves ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Owner</TableHead>
                <TableHead className="w-36">
                  <Abbreviation short="Coll.">Collateral</Abbreviation>
                  <div className="text-xs md:text-sm font-normal opacity-50">AR</div>
                </TableHead>
                <TableHead className="w-36">
                  Debt
                  <div className="text-xs md:text-sm font-normal opacity-50">{COIN}</div>
                </TableHead>
                <TableHead className="w-36">
                  Coll.
                  <br />
                  Ratio
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="w-36">
                    <div className="flex items-center" style={{ height: rowHeight }}>
                      <Skeleton className="h-4 w-33" />
                    </div>
                  </TableCell>
                  <TableCell className="w-36">
                    <Skeleton className="h-4 w-30" />
                  </TableCell>
                  <TableCell className="w-36">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="w-36">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="w-16">
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : troves.length === 0 ? (
          <div className="p-4 text-center text-lg">
            There are no Vaults yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Owner</TableHead>
                <TableHead className="w-36">
                  <Abbreviation short="Coll.">Collateral</Abbreviation>
                  <div className="text-xs md:text-sm font-normal opacity-50">AR</div>
                </TableHead>
                <TableHead className="w-36">
                  Debt
                  <div className="text-xs md:text-sm font-normal opacity-50">{COIN}</div>
                </TableHead>
                <TableHead className="w-36">
                  Coll.
                  <br />
                  Ratio
                </TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {troves.map(
                trove =>
                  !trove.isEmpty && ( // making sure the Trove hasn't been liquidated
                    // (WONT-FIX: remove check after we can fetch multiple Troves in one call)
                    <TableRow key={trove.ownerAddress}>
                      <TableCell className="w-36">
                        <div className="flex items-center" style={{ height: rowHeight }}>
                          <Tooltip message={trove.ownerAddress} placement="top">
                            <span className="w-[73px] overflow-hidden relative">
                              {shortenAddress(trove.ownerAddress)}
                              <div className="block md:hidden absolute top-0 right-0 w-[50px] h-full bg-gradient-to-r from-transparent to-white" />
                            </span>
                          </Tooltip>

                          <CopyToClipboard
                            text={trove.ownerAddress}
                            onCopy={() => setCopied(trove.ownerAddress)}
                          >
                            <Button variant="link" className="w-6 h-6">
                              {copied === trove.ownerAddress ? <ClipboardCheckIcon size={16}/> : <ClipboardIcon size={16}/>}
                            </Button>
                          </CopyToClipboard>
                        </div>
                      </TableCell>
                      <TableCell className="w-36">
                        <Abbreviation short={trove.collateral.shorten()}>
                          {trove.collateral.prettify(4)}
                        </Abbreviation>
                      </TableCell>
                      <TableCell className="w-36">
                        <Abbreviation short={trove.debt.shorten()}>
                          {trove.debt.prettify()}
                        </Abbreviation>
                      </TableCell>
                      <TableCell className="w-36">
                        {(collateralRatio => (
                          <span
                            className={
                              collateralRatio.gt(CRITICAL_COLLATERAL_RATIO)
                                ? "text-success"
                                : collateralRatio.gt(1.2)
                                ? "text-warning"
                                : "text-danger"
                            }
                          >
                            {new Percent(collateralRatio).prettify()}
                          </span>
                        ))(trove.collateralRatio(price))}
                      </TableCell>
                      <TableCell className="w-16">
                        <Transaction
                          id={`liquidate-${trove.ownerAddress}`}
                          tooltip="Liquidate"
                          requires={[
                            recoveryMode
                              ? liquidatableInRecoveryMode(
                                  trove,
                                  price,
                                  totalCollateralRatio,
                                  lusdInStabilityPool
                                )
                              : liquidatableInNormalMode(trove, price)
                          ]}
                          send={liquity.send.liquidate.bind(liquity.send, trove.ownerAddress)}
                        >
                          <Button variant="link">
                            <Trash2Icon/>
                          </Button>
                        </Transaction>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
