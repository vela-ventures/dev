import { CheckIcon, EllipsisIcon, XIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
  className?: string;
};

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ state, message, className = "" }) => {
  if (state === "idle" || state === "waitingForApproval") {
    return null;
  }

  const bgColor =
    state === "confirmed"
      ? "bg-green-600"
      : state === "cancelled"
      ? "bg-yellow-500"
      : state === "failed"
      ? "bg-destructive"
      : "bg-primary";

  return (
    <div
      className={`flex items-center p-3 pl-4 fixed w-screen bottom-0 overflow-hidden ${bgColor} ${className}`}
    >
      <div className="mr-3 w-10 h-10">
        <TransactionProgressDonut state={state} />
      </div>

      <span className="text-xl text-white">
        {state === "waitingForConfirmation"
          ? "Waiting for confirmation"
          : state === "cancelled"
          ? "Cancelled"
          : state === "failed"
          ? message || "Transaction failed. Please try again."
          : "Confirmed"}
      </span>
    </div>
  );
};
