import { expect } from "chai";
import { ethers } from "ethers";

import cron from "node-cron";

const providerKovan = new ethers.providers.JsonRpcProvider(
    "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
  );

const accountX = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`).connect(
    providerKovan
  );




