import { Spinner } from "./ui/spinner";

export const AppLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner className="m-2 text-foreground size-6" />
    <h1 className="text-2xl font-bold">Loading...</h1>
  </div>
);
