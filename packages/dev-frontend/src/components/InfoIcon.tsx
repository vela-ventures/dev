import { CircleQuestionMarkIcon } from "lucide-react";
import React from "react";
import type { TooltipProps } from "./Tooltip";
import { Tooltip } from "./Tooltip";

export type InfoIconProps = Pick<TooltipProps, "placement" | "link" > & {
    tooltip: React.ReactNode;
  };

export const InfoIcon: React.FC<InfoIconProps> = ({
  link,
  placement = "right",
  tooltip,
}) => {
  return (
    <Tooltip message={tooltip} placement={placement} link={link}>
      <CircleQuestionMarkIcon size={12} className="ml-1"/>
    </Tooltip>
  );
};
