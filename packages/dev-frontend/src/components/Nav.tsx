import { Box } from "theme-ui";
import { Link } from "./Link";

// const TemporaryNewBadge = () => {
//   const isBeforeNovember2022 = new Date() < new Date("2022-11-01");
//   if (!isBeforeNovember2022) return null;
//   return (
//     <Badge ml={1} sx={{ fontSize: "12px" }}>
//       New
//     </Badge>
//   );
// };

export const Nav: React.FC = () => {
  return (
    <Box as="nav" sx={{ display: ["none", "flex"], alignItems: "center", flex: 1 }}>
      <div className="flex">
        <Link to="/">Dashboard</Link>
        <Link to="/risky-troves">Risky Vaults</Link>
        <Link to="/faucet">Faucet</Link>
        {/* <Link to="/bonds">
          <div className="flex items-center">
            <Text>Bonds</Text>
            <TemporaryNewBadge />
          </div>
        </Link> */}
      </div>
      {/* <div className="flex justify-end mr-3 flex-1">
        <Link sx={{ fontSize: 1 }} to="/risky-troves">
          Risky Vaults
        </Link>
      </div> */}
    </Box>
  );
};
