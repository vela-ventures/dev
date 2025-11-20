import { CheckIcon, EllipsisIcon, XIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Box, Text, ThemeUIStyleObject } from "theme-ui";
import type { TransactionState } from "./Transaction";

const strokeWidth = 10;

const circularProgressbarStyle = {
  strokeLinecap: "butt",
  pathColor: "white",
  trailColor: "rgba(255, 255, 255, 0.33)"
};

const slowProgress = {
  strokeWidth,
  styles: buildStyles({
    ...circularProgressbarStyle,
    pathTransitionDuration: 30
  })
};

const fastProgress = {
  strokeWidth,
  styles: buildStyles({
    ...circularProgressbarStyle,
    pathTransitionDuration: 0.75
  })
};

export type TransactionStateType = TransactionState["type"];

const Donut = memo(
  CircularProgressbarWithChildren,
  ({ value: prev }, { value: next }) => prev === next
);

type TransactionProgressDonutProps = {
  state: TransactionStateType;
};

const TransactionProgressDonut: React.FC<TransactionProgressDonutProps> = ({ state }) => {
  const [value, setValue] = useState(0);
  const maxValue = 1;

  useEffect(() => {
    if (state === "confirmed") {
      setTimeout(() => setValue(maxValue), 40);
    } else {
      setTimeout(() => setValue(maxValue * 0.67), 20);
    }
  }, [state]);

  return state === "confirmed" ? (
    <Donut {...{ value, maxValue, ...fastProgress }}>
      <CheckIcon color="white"/>
    </Donut>
  ) : state === "failed" || state === "cancelled" ? (
    <Donut value={0} {...{ maxValue, ...fastProgress }}>
      <XIcon color="white"/>
    </Donut>
  ) : (
    <Donut {...{ value, maxValue, ...slowProgress }}>
      <EllipsisIcon color="white"/>
    </Donut>
  );
};

type TransactionStatusProps = {
  state: TransactionStateType;
  message?: string;
  style?: ThemeUIStyleObject;
};

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ state, message, style }) => {
  if (state === "idle" || state === "waitingForApproval") {
    return null;
  }

  return (
    <div
      className="flex items-center p-3 pl-4 fixed w-screen bottom-0 overflow-hidden"
      style={{
        backgroundColor:
          state === "confirmed"
            ? "var(--theme-ui-colors-success)"
            : state === "cancelled"
            ? "var(--theme-ui-colors-warning)"
            : state === "failed"
            ? "var(--theme-ui-colors-danger)"
            : "var(--theme-ui-colors-primary)",
        ...(style as React.CSSProperties)
      }}
    >
      <Box sx={{ mr: 3, width: "40px", height: "40px" }}>
        <TransactionProgressDonut state={state} />
      </Box>

      <Text sx={{ fontSize: 3, color: "white" }}>
        {state === "waitingForConfirmation"
          ? "Waiting for confirmation"
          : state === "cancelled"
          ? "Cancelled"
          : state === "failed"
          ? message || "Transaction failed. Please try again."
          : "Confirmed"}
      </Text>
    </div>
  );
};
