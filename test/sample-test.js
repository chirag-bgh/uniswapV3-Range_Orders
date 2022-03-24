const { ethers } = require("hardhat");
const abi = require("../abi.json");

describe("Uniswap V3 Range Orders", async function () {
  

  let wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const token0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //weth mainnet
  const token1 = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; //usdc mainnet
  // const token0 = "0xc778417E063141139Fce010982780140Aa0cD5Ab"; //WETH
  // const token1 = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926"; //USDC    //rinkeby
  const signerAddr = "0x72A53cDBBcc1b9efa39c834A540550e23463AAcB";
  
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [signerAddr],
  });
  signer = await ethers.getSigner(signerAddr);

  const usdc = await new ethers.Contract(token1, abi);
  const weth = await new ethers.Contract(token0, abi);
  
  const amount0 = 1 * 10 ** 18;
  const amount1 = 1 * 10 ** 6
  const amount0Min = 0;
  const amount1Min = 0;
  const fee = 3000;
  const price = 3000;

  function sqrt(value) {
    let priceBN = ethers.BigNumber.from(value);
    let ONE = ethers.BigNumber.from(1);
    let TWO = ethers.BigNumber.from(2);
    let z = priceBN.add(ONE).div(TWO);
    let y = priceBn;
    while (z.sub(y).isNegative()) {
      y = z;
      z = priceBN.div(z).add(z).div(TWO);
    }
    return y;
  }

  it("Should place limit order", async function () {
    //deploy
    const LimitOrder = await ethers.getContractFactory("LimitOrder");
    const limitOrder = await LimitOrder.deploy();
    await limitOrder.deployed();

    //sort
    if(token0 > token1) {
      let temp = token1;
      token1 = token0;
      token0 = temp;
      temp = amount1;
      token1 = amount0;
      token0 = temp;
      
    }

    //sqrtPrice = sqrt(price) * 2 ** 96
    let sqrtPrice = sqrt(price) * 2 ** 96;
    let sqrtPriceX96 = sqrtPrice;
    //approve
    let _token0 = await new ethers.Contract(token0, abi);
    await _token0.connect(signer).approve(limitOrder.address, amount0);
    let _token1 = await new ethers.Contract(token1, abi);
    await _token1.connect(signer).approve(limitOrder.address, amount1);
    // call
    let tx = await limitOrder.connect(signer).placeLimitOrder({
      _token0: token0,
      _token1: token1,
      _fee: fee,
      _sqrtPriceX96: sqrtPriceX96,
      _amount0: amount0,
      _amount1: amount1,
      _amount0Min: amount0Min,
      _amount1Min: amount1Min
    });
    console.log(tx);
      
  });
});