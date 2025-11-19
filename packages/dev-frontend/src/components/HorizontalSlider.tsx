import { Button } from "@/components/ui/button";
import { Decimal } from "@liquity/lib-base";
import { Text, Slider as ThemeUiSlider } from "theme-ui";
import { toFloat } from "./Bonds/utils";
import { InfoIcon } from "./InfoIcon";

type SliderProps = {
  name: string;
  description?: string;
  descriptionLink?: string;
  value: Decimal;
  type: string;
  min: string;
  max: string;
  step?: number;
  onSliderChange: (value: Decimal) => void;
  onReset?: () => void;
};

export const HorizontalSlider: React.FC<SliderProps> = ({
  name,
  description,
  descriptionLink,
  value,
  type,
  min,
  max,
  step = 0.01,
  onSliderChange,
  onReset
}) => {
  return (
    <div className="flex flex-col mb-2 mx-1">
      <div
        className="flex items-center justify-center"
        style={{
          fontWeight: "300"
        }}
      >
        {name}
        {description && <InfoIcon size="xs" tooltip={description} link={descriptionLink} />}
        {onReset && (
          <Button
            variant="icon"
            sx={{
              m: 0,
              ml: "24px",
              mt: 1,
              border: "none",
              fontSize: 1,
              width: 0,
              height: 0
            }}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="flex grow items-center">
        <Text mr={2} sx={{ fontSize: 1 }}>
          {min}
        </Text>
        <ThemeUiSlider
          value={toFloat(value)}
          min={min}
          max={max}
          step={step}
          onChange={e => onSliderChange(Decimal.from(e.target.value))}
        ></ThemeUiSlider>
        <Text ml={2} sx={{ fontSize: 1 }}>
          {max}
        </Text>
      </div>
      <div className="flex justify-center items-center" style={{ fontWeight: "400" }}>
        <Text>
          {value.prettify(2)} {type}
        </Text>
      </div>
    </div>
  );
};
