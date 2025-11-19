import React from "react";
import { InfoIcon } from "./InfoIcon";
import type { Lexicon } from "../lexicon";

type StatisticProps = React.PropsWithChildren<{
  lexicon: Lexicon;
}>;

export const Statistic: React.FC<StatisticProps> = ({ lexicon, children }) => {
  return (
    <div className="flex" style={{ borderBottom: 1, borderColor: "rgba(0, 0, 0, 0.1)" }}>
      <div className="flex items-center justify-start" style={{ flex: 1.2, fontWeight: 200 }}>
        <div className="flex">{lexicon.term}</div>
        {lexicon.term && <InfoIcon size="xs" tooltip={lexicon.description} link={lexicon.link} />}
      </div>
      <div className="flex justify-end items-center" style={{ flex: 1 }}>{children}</div>
    </div>
  );
};
