import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useEffect, useState } from "react";
import { useLiquity } from "../hooks/LiquityContext";
import { Button } from "./ui/button";

import { ChartLineIcon } from "lucide-react";
import { Transaction } from "./Transaction";

const selectPrice = ({ price }: LiquityStoreState) => price;

export const PriceManager: React.FC = () => {
  const {
    liquity: {
      send: liquity,
      connection: { _priceFeedIsTestnet: canSetPrice }
    }
  } = useLiquity();

  const price = useLiquitySelector(selectPrice);
  const [editedPrice, setEditedPrice] = useState(price.toString(2));

  useEffect(() => {
    setEditedPrice(price.toString(2));
  }, [price]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Price feed</CardTitle>
      </CardHeader>

      <CardContent className="p-2 md:p-3 flex items-stretch">
        <Label className="mr-2">AR/GiB</Label>

        <Input
          type={canSetPrice ? "number" : "text"}
          step="any"
          value={editedPrice}
          onChange={e => setEditedPrice(e.target.value)}
          disabled={!canSetPrice}
        />

        {canSetPrice && (
          <div className="flex ml-2 items-center">
            <Transaction
              id="set-price"
              tooltip="Set"
              tooltipPlacement="bottom"
              send={overrides => {
                if (!editedPrice) {
                  throw new Error("Invalid price");
                }
                return liquity.setPrice(Decimal.from(editedPrice), overrides);
              }}
            >
              <Button variant="outline">
                <ChartLineIcon />
              </Button>
            </Transaction>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
