import { InfoIcon } from "../InfoIcon";
import { Placeholder } from "../Placeholder";
import type { Lexicon } from "../../lexicon";

type RecordType = {
  lexicon: Lexicon;
  description?: string;
  value?: string;
  type?: string;
};

export const Record: React.FC<RecordType> = ({ lexicon, value, type }) => {
  return (
    <div className="flex flex-col">
      <h4 className="flex font-light items-baseline justify-center">
        {lexicon.term} <InfoIcon tooltip={lexicon.description} link={lexicon.link} />
      </h4>
      <h3 className="flex justify-center">
        {value ? (
          <span className="font-normal">{value}</span>
        ) : (
          <Placeholder style={{ mx: "20%" }} />
        )}
        &nbsp;
        {value && <span className="font-light opacity-80">{type}</span>}
      </h3>
    </div>
  );
};
