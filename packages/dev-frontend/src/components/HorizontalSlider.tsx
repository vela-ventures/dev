import { Decimal } from "@liquity/lib-base";
import { Text, Slider as ThemeUiSlider } from "theme-ui";
import { toFloat } from "./Bonds/utils";
import { InfoIcon } from "./InfoIcon";
import { Button } from "./ui/button";

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
      <h4 className="flex font-light items-center justify-center">
        {name}
        {description && <InfoIcon tooltip={description} link={descriptionLink} />}
        {onReset && (
          <Button
            variant="link"
            className="m-0 ml-6 mt-1 border-none text-xs w-auto h-auto"
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </h4>

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
      <div className="flex font-normal justify-center items-center">
        <Text>
          {value.prettify(2)} {type}
        </Text>
      </div>
    </div>
  );
};
