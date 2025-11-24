import { Spinner } from "theme-ui";

export const AppLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner sx={{ m: 2, color: "text" }} size={32} />
    <h1 className="text-lg font-semibold">Loading...</h1>
  </div>
);
