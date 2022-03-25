/* eslint-disable no-nested-ternary */
import { useWeb3React } from "@web3-react/core";

import { Account } from "./Account";
import { Balance } from "./Balance";
import { ChainId } from "./ChainId";
import Connect from "./Connect";

export const Portal = function () {
  return (
    <div className="card lg:card-side w-96 glass">
        <figure><img src="https://api.lorem.space/image/car?w=400&h=225" alt="car!"/></figure>
        <div className="card-body">
            <h2 className="card-title">Life hack</h2>
            <p>How to park your car at your garage?</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary">Learn now!</button>
            </div>
        </div>  
    </div>
  );
};

export default Portal;