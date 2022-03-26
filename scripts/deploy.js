const { ethers } = require("hardhat");

async function main() {
    
    const limitorder = await ethers.getContractFactory("UniswapLimitOrder");
    const _limitorder = await limitorder.deploy("0x76F2CCD13DB4D70DFB2114704BD9d4d6326bafA0");  
    await _limitorder.deployed();
    console.log("LimitOrder address:", _limitorder.address);

    // const resolver = await ethers.getContractFactory("Position");
    // const _resolver = await resolver.deploy();
    // await _resolver.deployed();
    // console.log("Resolver address:", _resolver.address);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
