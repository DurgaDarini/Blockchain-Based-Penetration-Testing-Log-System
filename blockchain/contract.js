const { ethers } = require("ethers");
require("dotenv").config();

const contractABI =
  require("../../blockchain/artifacts/contracts/PentestLog.sol/PentestLog.json").abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Use first Hardhat account
const signer = provider.getSigner(0);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  signer
);

module.exports = contract;
