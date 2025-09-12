const externalAddrs = {
  // No Data Feeds
  // CHAINLINK_ETHUSD_PROXY: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  // TELLOR_MASTER: "0x20374E579832859f180536A69093A126Db1c8aE9",
  // https://uniswap.org/docs/v2/smart-contracts/factory/
  UNISWAP_V2_FACTORY: "0xDF8f291928223BFE248a3e4E68ACf7E879396A8a",
  UNISWAP_V2_ROUTER02: "0xa2Eb4FC1EE404447aCE9463530c9611487A73D40",
  WETH_ERC20: "0x611B6deD9b7029592D8eccBcF8Ca10Bb88B80c4D"
};

const liquityAddrsTest = {
  GENERAL_SAFE: "0x8be7e24263c199ebfcfd6aebca83f8d7ed85a5dd", // Hardhat dev address
  LQTY_SAFE: "0x20c81d658aae3a8580d990e441a9ef2c9809be74", //  Hardhat dev address
  // LQTY_SAFE:"0x66aB6D9362d4F35596279692F0251Db635165871",
  DEPLOYER: "0x66aB6D9362d4F35596279692F0251Db635165871" // Mainnet test deployment address
};

const liquityAddrs = {
  GENERAL_SAFE: "0xaA67e97ec229Dea823F3f665B1cD61EcB35d99E7", // TODO
  LQTY_SAFE: "0x07c667509c443659C2b34106eEc506F2216c300D", // TODO
  DEPLOYER: "0x1D6d4833fd4E1a138F12dd79a439E925A172dd79"
};

const beneficiaries = {
  TEST_INVESTOR_A: "0x247052921170cc8763882460bE3Cd99b84A0122D",
  TEST_INVESTOR_B: "0x0440b930d8757965B55BbdBA1E38B7BAaa666844",
  TEST_INVESTOR_C: "0xC4EE23806ea8eA1A02394d430303ba5C98f899e8"
};

const OUTPUT_FILE = "./mainnetDeployment/loadDeploymentOutput.json";

const delay = ms => new Promise(res => setTimeout(res, ms));
const waitFunction = async () => {
  return delay(90000); // wait 90s
};

const GAS_PRICE = 1000000000; // 1 Gwei
const TX_CONFIRMATIONS = 1;

const ETHERSCAN_BASE_URL = "https://explorer.load.network/address";

module.exports = {
  externalAddrs,
  liquityAddrs,
  beneficiaries,
  OUTPUT_FILE,
  waitFunction,
  GAS_PRICE,
  TX_CONFIRMATIONS,
  ETHERSCAN_BASE_URL
};
