import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type InfoMessageProps = React.PropsWithChildren<{
  title: string;
  icon?: React.ReactNode;
  margin?: number;
}>;

export const InfoMessage: React.FC<InfoMessageProps> = ({ title, children, icon, margin }) => (
  <Card className={`mt-${margin}`}>
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
