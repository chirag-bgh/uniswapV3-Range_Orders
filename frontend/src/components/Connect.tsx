import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { useEffect, useState } from "react";

import metamask from "../../public/metamask.png";
import { injected, walletconnect, POLLING_INTERVAL } from "../dapp/connectors";
import { useEagerConnect, useInactiveListener } from "../dapp/hooks";
import logger from "../logger";

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

export const Connect = function Connect() {
  const context = useWeb3React<Web3Provider>();
  const { connector, library, account, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const activating = (connection: typeof injected | typeof walletconnect) => connection === activatingConnector;
  const connected = (connection: typeof injected | typeof walletconnect) => connection === connector;
  const disabled = !triedEager || !!activatingConnector || connected(injected) || connected(walletconnect) || !!error;
  return (
    <>
    <div className="inline-flex">
      <button
        type="button"
        className="btn bg-transparent hover:bg-pink-600 text-pink-700 font-semibold hover:text-white px-4 border border-pink-600 hover:border-transparent rounded"
        disabled={disabled}
        onClick={() => {
          setActivatingConnector(injected);
          activate(injected);
        }}
      >Connect<div className="inline-flex">
      {activating(injected) && <p className="btn loading">loading...</p>}
      {connected(injected) && (
        <span aria-label="check">
          ed
        </span>
      )}
    </div>
      </button>
      
      
      {(active || error) && connected(injected) && (
        <>
          <button
            type="button"
            className="bg-transparent hover:bg-pink-600 text-pink-700 font-semibold hover:text-white px-4 border border-pink-600 hover:border-transparent rounded"
            onClick={() => {
              if (connected(walletconnect)) {
                (connector as any).close();
              }
              deactivate();
            }}
          >
            Deactivate
          </button>
        </>
      )}
    </div>
    </>
  );
};

export default Connect;
