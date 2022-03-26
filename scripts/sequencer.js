import { expect } from "chai";
import { ethers } from "ethers";
import cron from "node-cron";
import LimitOrderABI from "./limitorder.json";
import poolABI from "./poolABI.json";

require('dotenv').config()
const PrivateKey = process.env.PRIVATE_KEY;


const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
);

const accountX = new ethers.Wallet(`0x${PrivateKey}`).connect(
  providerKovan
);


const LimitOrderAddress = "0x26b8ec473aEee952cA11860C20943586a3c46c3a";
const LimitOrderInstance = new ethers.Contract(
  LimitOrderAddress,
  LimitOrderABI,
  providerKovan
);

// const resolverAddress = "0xA99E3B631eBb9fbc83b72a8aCF0979E210Ef0a5A";
// const resolverInstance = new ethers.Contract(
//   resolverAddress,
//   resolverABI,
//   providerKovan
// )

let filter1 = LimitOrderInstance.filters.LimitOrderCreated;
// let filter2 = LimitOrderInstance.filters.LimitOrderCollected;

const checks = []

cron.schedule(`* * * * * *`, async () => {
  try {
    console.log("Sequencer up and running");

    LimitOrderInstance.on(filter1, (owner, pool, _tokenId, tickArr) => {
      checks.push({
        owner,
        pool: new ethers.Contract(
          pool,
          poolABI, 
          providerKovan
        ),
        _tokenId,
        lowerTick: tickArr[0],
        upperTick: tickArr[1],
        currentTick: tickArr[2]
      })
    });
  } catch (error) {
    console.log("success");
  }
});

cron.schedule(`* * * * * *`, async () => {
  try {
    for (let order of checks) {
      const currTick = (await pool.slot0())[0]
      if (order.currentTick <= order.lowerTick && currTick >= order.upperTick){
        await LimitOrderInstance.connect(accountX).processLimitOrder(order._tokenId)
        checks.splice(indexOf[order]);}
       else if (order.currentTick >= order.upperTick && currTick <= order.lowerTick){ 
        await LimitOrderInstance.connect(accountX).processLimitOrder(order._tokenId)
        checks.splice(indexOf[order]);}
       else continue
    }    


  } catch (error) {
    console.log("success");
  }
});