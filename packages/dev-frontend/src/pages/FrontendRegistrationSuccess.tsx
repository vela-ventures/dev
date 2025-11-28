import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

type FrontendRegistrationSuccessProps = {
  onDismiss: () => void;
};

export const FrontendRegistrationSuccess: React.FC<FrontendRegistrationSuccessProps> = ({
  onDismiss
}) => (
  <>
    <div className="flex flex-col justify-around m-3 mt-4 mb-4 p-4 max-w-[500px] bg-green-50 text-green-600 border border-green-600 rounded-lg shadow-md">
      <div className="flex items-center mx-3 mb-4 text-2xl">
        <CheckIcon />
        <h1 className="ml-3 text-xl font-semibold">Success!</h1>
      </div>

      <p className="text-base">Your frontend is now ready to receive LQTY rewards.</p>
    </div>

    <Button onClick={onDismiss}>Go to Dashboard</Button>
  </>
);
