import { expect } from "chai";
import { ethers } from "ethers";
import cron from "node-cron";
import LimitOrderABI from "./limitorder.json";
import resolverABI from "./resolver.json";
require('dotenv').config()
const PrivateKey = process.env.PRIVATE_KEY;


const providerKovan = new ethers.providers.JsonRpcProvider(
    "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b"
  );

const accountX = new ethers.Wallet(`0x${PrivateKey}`).connect(
    providerKovan
  );

// let contractWithSigner = LimitOrderInstance.connect(accountX);


const LimitOrderAddress = "0xdb559E561515fbBD149FBfe15F404bef93863843";
const LimitOrderInstance = new ethers.Contract(
  LimitOrderAddress,
  LimitOrderABI,
  providerKovan
);

const resolverAddress = "0xA99E3B631eBb9fbc83b72a8aCF0979E210Ef0a5A";
const resolverInstance = new ethers.Contract(
  resolverAddress,
  resolverABI,
  providerKovan
)




let filter1 = LimitOrderInstance.filters.LimitOrderCreated;
let filter2 = LimitOrderInstance.filters.LimitOrderCollected;


cron.schedule(`* * * * * *`, async () => {
    try {
      console.log("Sequencer up and running");

      LimitOrderInstance.on(filter1, ( _tokenId , amountIn1, amountIn2, event) => {
        const amount1 = resolverInstance.methods.amountCheck(_tokenId);
        const amount2 = resolverInstance.methods.amountCheck(_tokenId);
        
        if (amountIn1 == 0 && amount2 == 0) {
          LimitOrderInstance.processLimitOrder(_tokenId);          
        } else if ( amountIn2 == 0 && amount1 == 0) {
          LimitOrderInstance.processLimitOrder(_tokenId);
        }

           
      });



    } catch (error) {
      console.log("success");
    }

  });
