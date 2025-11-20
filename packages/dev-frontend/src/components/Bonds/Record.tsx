import { Text } from "theme-ui";
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
      <Text as="h3" sx={{ display: "flex", justifyContent: "center" }}>
        {value ? (
          <Text sx={{ fontWeight: "400" }}>{value}</Text>
        ) : (
          <Placeholder style={{ mx: "20%" }} />
        )}
        &nbsp;
        {value && <Text sx={{ fontWeight: "light", opacity: 0.8 }}>{type}</Text>}
      </Text>
    </div>
  );
};
