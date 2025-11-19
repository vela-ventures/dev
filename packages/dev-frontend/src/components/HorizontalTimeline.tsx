import React from "react";
import { Box, Text } from "theme-ui";
import type { ThemeUIStyleObject } from "theme-ui";
import { InfoIcon } from "./InfoIcon";
import { Placeholder } from "./Placeholder";

const mutedGray = "#d9d9d9";

const defaultCircleStyle = {
  height: "12px",
  width: "12px",
  mx: "-1px",
  borderRadius: "50%",
  border: "2px solid",
  borderColor: mutedGray,
  background: "none",
  zIndex: 1
};
const solidCircleStyle = {
  backgroundColor: "gray",
  borderColor: "gray"
};
const transparentCircleStyle = {
  width: "0px",
  mx: "-2px",
  opacity: 0
};
const defaultLineStyle = {
  height: 4,
  flexGrow: 1,
  border: 0,
  backgroundColor: mutedGray,
  margin: 0,
  padding: 0
};

const solidLineStyle = {
  backgroundColor: "gray",
  opacity: 1
};

const fadeLineStyle = (leftColor: string, rightColor: string) => ({
  background: `linear-gradient(to right, ${leftColor}, ${rightColor})`
});

type CircleProps = {
  style?: ThemeUIStyleObject;
};

const Circle: React.FC<CircleProps> = ({ style }) => {
  return <Box sx={{ ...defaultCircleStyle, ...style }} />;
};

type LineProps = {
  style?: ThemeUIStyleObject;
};

const Line: React.FC<LineProps> = ({ style }) => {
  return <Box sx={{ ...defaultLineStyle, ...style }} />;
};

// Use the maximum possible date to represent unknown
export const UNKNOWN_DATE = new Date(8640000000000000);

export type EventType = {
  date: Date;
  label: React.ReactNode;
  isEndOfLife?: boolean;
  isMilestone?: boolean;
  isLoading?: boolean;
};

type EventProps = EventType & {
  isFirst: boolean;
  isLast: boolean;
  isPast: boolean;
};

type LabelProps = React.PropsWithChildren<{
  subLabel?: React.ReactNode;
  description?: React.ReactNode;
  style?: ThemeUIStyleObject;
}>;

type SubLabelProps = React.PropsWithChildren<{
  style?: ThemeUIStyleObject;
}>;

export const SubLabel: React.FC<SubLabelProps> = ({ style, children }) => (
  <div
    className="flex font-extralight text-[0.98em] self-center justify-center grow"
    style={style}
  >
    {children}
  </div>
);

export const Label: React.FC<LabelProps> = ({ children, description, style }) => {
  return (
    <div
      className="flex font-light self-center content-center items-center"
      style={style}
    >
      {children}
      &nbsp;
      {description ? <InfoIcon size="xs" tooltip={description} /> : null}
    </div>
  );
};

const LoadingEvent: React.FC<{ label: React.ReactNode }> = ({ label }) => {
  return (
    <div className="flex flex-col grow">
      <div className="flex justify-center">
        <Placeholder style={{ mx: "20%" }} />
      </div>
      <div className="flex my-1 items-center">
        <Line style={defaultLineStyle} />
        <Circle style={defaultCircleStyle} />
        <Line style={defaultLineStyle} />
      </div>

      <div className="flex flex-col">{label}</div>
    </div>
  );
};
const Event: React.FC<EventProps> = ({
  isFirst,
  isLast,
  isPast,
  date,
  label,
  isEndOfLife,
  isMilestone = true,
  isLoading
}) => {
  if (isLoading) return <LoadingEvent label={label} />;

  const isToday = date.toLocaleDateString() === new Date().toLocaleDateString();
  const isUnknownDate = date.toDateString() === UNKNOWN_DATE.toDateString();

  let circleStyle: ThemeUIStyleObject = { ...defaultCircleStyle };
  let leftLineStyle: ThemeUIStyleObject = { ...defaultLineStyle };
  let rightLineStyle: ThemeUIStyleObject = { ...defaultLineStyle };

  if (isPast || isEndOfLife) {
    circleStyle = { ...solidCircleStyle };
    leftLineStyle = { ...solidLineStyle };
  }

  if (isPast) {
    rightLineStyle = { ...solidLineStyle };
  }

  if (!isMilestone) {
    circleStyle = { ...transparentCircleStyle };
  }

  if (isFirst) {
    leftLineStyle = { ...leftLineStyle, ...fadeLineStyle("white", "gray") };
  }

  if (isLast) {
    rightLineStyle = { ...rightLineStyle, ...fadeLineStyle(mutedGray, "white") };
  }

  const dateText =
    isToday && isEndOfLife
      ? "Now"
      : isUnknownDate
      ? "Unknown"
      : date.toLocaleDateString("en-GB", { month: "short", day: "2-digit", year: "numeric" });

  return (
    <div className="flex flex-col grow">
      <div className="flex justify-center">
        <Text sx={{ fontWeight: 400, alignSelf: "center" }}>{dateText}</Text>
      </div>
      <div className="flex my-1 items-center">
        <Line style={leftLineStyle} />
        <Circle style={circleStyle} />
        <Line style={rightLineStyle} />
      </div>

      <div className="flex flex-col">{label}</div>
    </div>
  );
};

type HorizontalTimelineProps = {
  events: EventType[];
  style?: ThemeUIStyleObject;
};

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ events, style }) => {
  // Order by date, then by whether its selected or not (selected is newer)
  const orderedEvents = [...events].sort((a, b) =>
    a.date.getTime() === b.date.getTime()
      ? Number(a.isEndOfLife) - Number(b.isEndOfLife)
      : a.date.getTime() > b.date.getTime()
      ? 1
      : -1
  );

  const endOfLifeIdx = orderedEvents.findIndex(event => event.isEndOfLife);

  return (
    <div className="flex grow" style={style}>
      {orderedEvents.map((event, idx) => (
        <Event
          key={idx}
          isFirst={idx === 0}
          isLast={idx === orderedEvents.length - 1}
          isPast={idx < endOfLifeIdx}
          date={event.date}
          label={event.label}
          isEndOfLife={event.isEndOfLife}
          isMilestone={event.isMilestone}
          isLoading={event.isLoading}
        />
      ))}
    </div>
  );
};
