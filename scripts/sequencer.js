import { expect } from "chai";
import { ethers } from "ethers";
import "dotenv/config";
import cron from "node-cron";

const providerKovan = new ethers.providers.JsonRpcProvider(
    "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
  );

// const accountX = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`).connect(
//     providerKovan
//   );
const LimitOrderAddress = "contract aderss";

const LimitOrderInstance = new ethers.Contract(
  LimitOrderAddress,
  LimitOrderABI,
  providerKovan
);

const resolverAddress = ""
const resolverInstance = 


let filter1 = LimitOrderInstance.filters.LimitOrderCreated;
let filter2 = LimitOrderInstance.filters.LimitOrderCollected;




cron.schedule(`* * * * * *`, async () => {
    try {
      console.log("Sequencer up and running");

      LimitOrderInstance.on(filter1, (owner, _tokenId, token0To1, event) => {
        console.log("Limit Order Placed"); 
        console,log(_tokenId);
        processLimitOrder(_tokenId);       
      });
    } catch (error) {
      console.log("success");
    }
  });
