import React from "react";
import { InfoIcon } from "./InfoIcon";
import type { Lexicon } from "../lexicon";

type StatisticProps = React.PropsWithChildren<{
  lexicon: Lexicon;
}>;

export const Statistic: React.FC<StatisticProps> = ({ lexicon, children }) => {
  return (
    <div className="flex border-b border-black/10">
      <div className="flex items-center justify-start flex-[1.2] font-extralight">
        <div className="flex">{lexicon.term}</div>
        {lexicon.term && <InfoIcon tooltip={lexicon.description} link={lexicon.link} />}
      </div>
      <div className="flex justify-end flex-1 items-center">{children}</div>
    </div>
  );
};
