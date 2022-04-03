/* eslint-disable no-nested-ternary */
import { recoverAddress } from "@ethersproject/contracts/node_modules/@ethersproject/transactions";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { ethers } from "ethers";
import React from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";

import { injected, walletconnect, POLLING_INTERVAL } from "../dapp/connectors";
import { useEagerConnect, useInactiveListener } from "../dapp/hooks";
import useLocalStorage from "../hooks/useLocalStorage";
import logger from "../logger";
import { Account } from "./Account";
import { Balance } from "./Balance";
import { ChainId } from "./ChainId";
import Connect from "./Connect";
import options from "./options";
import SelectOptions from "./select";

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  }
  if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  }
  if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
    return "Please authorize this website to access your Ethereum account.";
  }
  logger.error(error);
  return "An unknown error occurred. Check the console for more details.";
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const Portal = function (props) {
  const context = useWeb3React<Web3Provider>();
  const { connector, library, account, active, error } = context;
  const triedEager = useEagerConnect();
  const connected = (connection: typeof injected | typeof walletconnect) => connection === connector;

  const rx = /^[+-]?\d*(?:[.,]\d*)?$/;
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState(0);
  const [token0to1, setToken0to1] = useState("token0to1");

  const handleChange = () => {
    localStorage.setItem("price", JSON.stringify(price));
    localStorage.setItem("amount", JSON.stringify(amount));
    localStorage.setItem("token0to1", JSON.stringify(token0to1));
  };
  const addr = "0x5ec8Ca596F1B13Fe45071Ada75BB5c4114788654";

  const orderOptions = [
    { value: "token0to1", label: "token0 to token1" },
    { value: "token1to0", label: "token1 to token0" },
  ];

  return (
    <div className="outer">
      <div className="cards">
        <div className="hline hline1"></div>
        <div className="img">
          <img
            className="logou"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Uniswap_Logo.png/600px-Uniswap_Logo.png?20210117061337"
          />
        </div>
        <div className="subtitle hfonts">
          A place for you to manage your limit orders. Set the price, amount and place your limit order. Automate the complete process starting from
          placing the limit order and removing the liquidity after processing it with no extra monitoring.
        </div>
      </div>
      <div className="cards">
        <hr className="dline" />
        <div className="labels"> Select Token:</div>
        <div className="box-right">
          <div className="token0 sfonts slabel">
            token0: <SelectOptions key="token0" options={options} />
          </div>
          <div className="token1 sfonts slabel">
            token1: <SelectOptions key="token1" options={options} />
          </div>
        </div>
        <div className="dottedLine"></div>
        <div className="glassfrost">0.3% fee tier</div>
        <div>
          <div className="slabel token0">Current Price:</div>
          <div className="glassfrost">{props.price}</div>
        </div>

        <form className="form">
          <div className="grids">
            <div className="grid1">
              <div className="labels">Enter Price: </div>
              <div className="token0 sfonts slabel ">
                price:
                <input
                  type="text"
                  className="inputs"
                  pattern="[+-]?\d+(?:[.,]\d+)?"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />{" "}
              </div>
              <div className="labels">Enter Amount: </div>
              <div className="token0 sfonts slabel ">
                amount:{" "}
                <input
                  type="number"
                  className="token0 sfonts slabel inputs"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />{" "}
              </div>
              <div className="labels">Select Order: </div>
              <div className="token0 slabel sfonts">
                order type: <SelectOptions key="order" options={orderOptions} />
              </div>
            </div>
            <div className="grid2">

              {(active || error) && connected(injected) && (
                <>
                  {!!(library && account) && (
                    <button
                      className="bttn"
                      onClick={(event) => {
                        event.preventDefault();
                        library
                          .getSigner(account)
                          .sendTransaction({ to: addr, value: ethers.utils.parseEther("0.001") })
                          .then((tx: any) => {
                            window.alert(
                              `Limit Order Placed successfully!\n\ntoken0: USDC\ntoken1: ETH\nPrice: 3143\nAmount: 0.001`
                            );
                          })
                          .catch((err: Error) => {
                            window.alert(`Failure!${err && err.message ? `\n\n${err.message}` : ""}`);
                          });
                      }}
                    >
                      {" "}
                      PLACE LIMIT ORDER
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </form>

        <div className="hline hline1 hline2"></div>
        <div className="line"></div>
        <div className="lineup"></div>
        <div className="lineup2"></div>
        <div className="line2"></div>
      </div>
    </div>
  );
};

export default Portal;
