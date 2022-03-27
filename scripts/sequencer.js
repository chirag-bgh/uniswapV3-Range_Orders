
const { ethers } = require("hardhat");
const { cron } = require("node-cron");
const { LimitOrderABI } = require("./limitorder.json");
const { poolABI } = require("./poolABI.json");
require('dotenv').config();
const PrivateKey = process.env.PRIVATE_KEY;


const providerKovan = new ethers.providers.JsonRpcProvider(
  "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
);

const accountX = new ethers.Wallet(`0x${PrivateKey}`).connect(
  providerKovan
);


const LimitOrderAddress = "0x38366568770dE7bd95532e28F257D5699FF90547";
console.log(69);

const LimitOrderInstance = new ethers.Contract(
  LimitOrderAddress,
  LimitOrderABI,
  providerKovan
);


let filter1 = LimitOrderInstance.filters.LimitOrderCreated;
// let filter2 = LimitOrderInstance.filters.LimitOrderCollected;

let checks = [];


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
      console.log(checks);
    });
  } catch (error) {
    console.log("error");
  }
  
});

cron.schedule(`* * * * * *`, async () => {
  try {
    for (let order of checks) {
      const currTick = (await pool.slot0())[0]
      if (order.currentTick <= order.lowerTick && currTick >= order.upperTick) {
        await LimitOrderInstance.connect(accountX).processLimitOrder(order._tokenId)
        checks.splice(indexOf[order]);
      }
      else if (order.currentTick >= order.upperTick && currTick <= order.lowerTick) {
        await LimitOrderInstance.connect(accountX).processLimitOrder(order._tokenId)
        checks.splice(indexOf[order]);
      }
      else continue
    }


  } catch (error) {
    console.log("error");
  }
});