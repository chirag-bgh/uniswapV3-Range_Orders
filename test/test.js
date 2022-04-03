// const BigNumber = require('bignumber.js');
const { ethers } = require("hardhat");
const abi = require("../abi.json");
// const LimitOrderABI = require("../scripts/limitorder.json");
require('dotenv').config();
const PrivateKey = process.env.PRIVATE_KEY;


describe("Uniswap V3 Range Orders", function () {
  // const token0 = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"; //weth kovan  
  const token1 = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; //USDC main  
  // const token1 = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"; //dai kovan
  const token0 = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //dai main
  // const providerKovan = new ethers.providers.JsonRpcProvider(
  //   "https://eth-kovan.alchemyapi.io/v2/I9zTx8c8e5mxGrGaSzAF29KOjOmEckA2"
  // );
  // const accountX = new ethers.Wallet(`0x${PrivateKey}`);



  const amount = "1000000"; //1 USDC
  const fee = "100";
  const price = "1";


  it("Should place limit order", async function () {

    const signerAddr = "0x72A53cDBBcc1b9efa39c834A540550e23463AAcB";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [signerAddr],
    });
    signer = await ethers.getSigner(signerAddr);

    const LO = await ethers.getContractFactory("UniswapLimitOrder");
    LimitOrderInstance = await LO.deploy("0x76F2CCD13DB4D70DFB2114704BD9d4d6326bafA0");
    await LimitOrderInstance.deployed();
    console.log("contractADD : ", LimitOrderInstance.address);

    let _token0 = new ethers.Contract(token0, abi);
    let txn = await _token0.connect(signer).approve(LimitOrderInstance.address, "10000000");//10USDC
    
    let tx = await LimitOrderInstance.connect(signer).placeLimitOrder(
      [token0, token1, fee, price, amount, "0", true]
    );
    console.log(tx);
  });
});