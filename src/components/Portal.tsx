/* eslint-disable no-nested-ternary */
import { recoverAddress } from "@ethersproject/contracts/node_modules/@ethersproject/transactions";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useState, useEffect, useRadioButtons } from "react";

import { Account } from "./Account";
import { Balance } from "./Balance";
import { Button } from "./Button";
import { ChainId } from "./ChainId";
import Connect from "./Connect";
import options from "./options";
import SelectOptions from "./select";

export const Portal = function (props) {
  const rx = /^[+-]?\d*(?:[.,]\d*)?$/;
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState(0);
  const [token0to1, setToken0to1] = useState("token0to1");

  const handleChange = () => {
    localStorage.setItem("price", JSON.stringify(price));
    localStorage.setItem("amount", JSON.stringify(amount));
    localStorage.setItem("token0to1", JSON.stringify(token0to1));
  };

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
          A place for you to manage your range orders. Set the price and place your limit order, Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Adipisci dicta aliquam perspiciatis officia deleniti minima omnis quasi,
          rerum debitis autem in corporis inventore quaerat magnam voluptates ipsa id rem soluta.
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
              <button className="bttn"> PLACE LIMIT ORDER</button>
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
