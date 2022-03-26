const { ethers } = require("hardhat");
const abi = require("../abi.json");
const LimitOrderABI = require("../scripts/limitorder.json");
require('dotenv').config()
const PrivateKey = process.env.PRIVATE_KEY;

const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
);

describe("Uniswap V3 Range Orders", async function () {

  
  const token0 = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"; //weth kovan
  const token1 = "0xdCFaB8057d08634279f8201b55d311c2a67897D2"; //usdc kovan
  const accountX = new ethers.accountX(`0x${PrivateKey}`).connect(
    providerKovan
  );

  const LimitOrderAddress = "0x26b8ec473aEee952cA11860C20943586a3c46c3a";
  const LimitOrderInstance = new ethers.Contract(
    LimitOrderAddress,
    LimitOrderABI,
    providerKovan
  );

  // const usdc = await new ethers.Contract(token1, abi);
  // const weth = await new ethers.Contract(token0, abi);

  const amount = 1 * 10 ** 15; //(0.001 ETH)
  const fee = 3000;
  const price = 3143;

 
  it("Should place limit order", async function () {

    this.timeout(60000);  
    let sqrtPriceX96 = Math.sqrt(price) * 2 ** 96;
    //approve
    let _token0 = await new ethers.Contract(token0, abi);
    await _token0.connect(accountX).approve(LimitOrderAddress, amount);
    let _token1 = await new ethers.Contract(token1, abi);
    await _token1.connect(accountX).approve(LimitOrderAddress, 0);
    // call
    let tx = await LimitOrderInstance.connect(accountX).placeLimitOrder({
      _token0: token0,
      _token1: token1,
      _fee: fee,
      _sqrtPriceX96: sqrtPriceX96,
      _amount: amount,
      _amountMin: 0,
      token0To1: true
    });

    console.log(tx);

  });
});