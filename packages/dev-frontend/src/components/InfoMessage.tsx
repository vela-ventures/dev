import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { InfoIcon } from "lucide-react";

type InfoMessageProps = React.PropsWithChildren<{
  title: string;
  icon?: React.ReactNode;
}>;

export const InfoMessage: React.FC<InfoMessageProps> = ({ title, children, icon }) => (
  <Card className="mt-8">
    <CardHeader>
      <CardTitle className="flex items-center">
        <div>{icon || <InfoIcon className="mr-2"/>}</div> {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
    {children}
    </CardContent>
  </Card>
);
