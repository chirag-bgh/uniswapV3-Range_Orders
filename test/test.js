const BigNumber = require('bignumber.js');
const { ethers } = require("hardhat");
const abi = require("../abi.json");
const LimitOrderABI = require("../scripts/limitorder.json");
require('dotenv').config();
const PrivateKey = process.env.PRIVATE_KEY;


describe("Uniswap V3 Range Orders", function () {
  const token0 = "0xd0A1E359811322d97991E03f863a0C30C2cF029C"; //weth kovan
  const token1 = "0xdCFaB8057d08634279f8201b55d311c2a67897D2"; //usdc kovan

  const providerKovan = new ethers.providers.JsonRpcProvider(
    "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
  );
  const accountX = new ethers.Wallet(`0x${PrivateKey}`).connect(
    providerKovan
  );
  
  const LimitOrderAddress = "0xe8b7AFBDAFbC94dcF2B5B4e99e8A764449DbEb93";
  const LimitOrderInstance = new ethers.Contract(
    LimitOrderAddress,
    LimitOrderABI,
    providerKovan
  );

  // const usdc = await new ethers.Contract(token1, abi);
  // const weth = await new ethers.Contract(token0, abi);

  const amount = ethers.utils.parseEther("0.001"); //(0.001 ETH)
  const fee = 3000;
  const price = 3143;


  let priceB = new BigNumber(price);
  let sqrtPriceB = priceB.squareRoot();
  let x = new BigNumber(2);
  let raised = x.exponentiatedBy(96);
  let sqrtPriceX96B = sqrtPriceB.multipliedBy(raised);
  
  
  it("Should place limit order", async function () {
    
    //approve
    let _token0 = new ethers.Contract(token0, abi);
    await _token0.connect(accountX).approve(LimitOrderAddress, amount);

    
    // call
    let tx = await LimitOrderInstance.connect(accountX).placeLimitOrder({
      _token0: token0,
      _token1: token1,
      _fee: fee,
      _sqrtPriceX96: sqrtPriceX96B.toFixed(),
      _amount: amount,
      _amountMin: "0",
      token0To1: true
    });

    console.log(tx);
  });
});