import { Spinner, Heading } from "theme-ui";

export const AppLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner sx={{ m: 2, color: "text" }} size={32} />
    <Heading>Loading...</Heading>
  </div>
);
