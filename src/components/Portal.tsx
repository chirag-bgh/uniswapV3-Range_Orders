/* eslint-disable no-nested-ternary */
import { recoverAddress } from "@ethersproject/contracts/node_modules/@ethersproject/transactions";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import { Account } from "./Account";
import { Balance } from "./Balance";
import { ChainId } from "./ChainId";
import Connect from "./Connect";
import SelectOptions from "./select";

export const Portal = function (props) {
  return (
    <div className="cards">
        <div className="hline"></div>
        <div className="titles">Limit Order</div>
        <div className="hline"></div>
        <div className="subtitle hfonts">A place for you to manage your range orders. Set the price and place your limit order, Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dicta aliquam perspiciatis officia deleniti minima omnis quasi, rerum debitis autem in corporis inventore quaerat magnam voluptates ipsa id rem soluta.</div>
        <hr className="dline"/>
        <div className="labels"> Select Token:</div>
        <div className="box-right">
          <div className="token0 sfonts slabel">token0: <SelectOptions/></div>
          <div className="token1 sfonts slabel">token1: <SelectOptions/></div>
        </div>
        <div className="dottedLine"></div>
        <div className="glassfrost">0.3% fee tier</div>
        <div>
        <div className="slabel token0">Current Price:</div>
        <div className="glassfrost">{props.price}</div>
        </div>
        <form className="forms">
          <input type="number" className="inputs"
        </form>
        <div className="line"></div>
        <div className="lineup"></div>
        <div className="lineup2"></div>
        <div className="line2"></div>
    </div>
  );
};

export default Portal;