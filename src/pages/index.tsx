import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";

import Demo, { getLibrary } from "../components/Demo";
import Firefly from "../components/Firefly";
import Portal from "../components/Portal";
import useLocalStorage from "../hooks/useLocalStorage";

const App = function () {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      document.documentElement.setAttribute("data-theme", prevTheme === "dark" ? "light" : "dark");
      return prevTheme === "dark" ? "light" : "dark";
    });
  };
  return (
    <>
      <div className="fixed top-0 right-0 mt-2 mr-4">
        <button type="button" onClick={toggleTheme} className="btn">
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
      </div>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div className="container min-h-screen mx-auto">
          {/* <Firefly/> */}
          <Demo />
    <div className="top">
    <div className="hline"></div>
    <div className="heading">
    <div className="titles">Limit Order</div>
    </div>
    <div className="hline"></div>
    </div>
   
          {/* <div className="cont">
            <div className="img">
              <img className="logou" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Uniswap_Logo.png/600px-Uniswap_Logo.png?20210117061337" />
            </div>
            <div className="portaldiv"> */}
              <Portal price='3500'/>
            {/* </div> */}
            {/* <div className="image"> <img className= "uniswap" src="https://cdn3d.iconscout.com/3d/free/thumb/uniswap-3443548-2879644.png"/></div>  */}
          {/* </div> */}
          {/* <div className="hero">
            <div className="text-center hero-content">
              <div className="max-w-md px-4 py-8">
                <figure className="mb-5">
                  <img src="" alt="logo" className="mask mask-squircle" />
                </figure>
                <h1 className="mb-5 text-5xl font-bold">Hello Dapp Starter</h1>
                <p className="mb-5">
                  Edit <code>pages/index.tsx</code> and save to test HMR updates.
                </p>
              </div>
            </div>
          </div>*/}
        </div>
        <footer className="p-10 footer bg-base-200 text-base-content">
          <div>
            <p>
              Project Name <br />
              Built with love from{" "}
              <a className="link" href="https://github.com/jellydn">
                HashSquad
              </a>
            </p>
          </div>
          <div>
            <span className="footer-title">Document</span>
            <a
              href="https://nextjs.org/docs/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              Nextjs Docs
            </a>
            <a href="https://hardhat.org/" target="_blank" rel="noopener noreferrer" className="link link-hover">
              Hardhat
            </a>
            <a href="https://daisyui.com/" target="_blank" rel="noopener noreferrer" className="link link-hover">
              daisyUI
            </a>
            <a
              href="https://github.com/NoahZinsmeister/web3-react"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              Web3 React
            </a>
          </div>
          <div>
            <span className="footer-title">1-click Deployment</span>
            <a
              className="pl-2"
              href="https://vercel.com/new/git/external?repository-url=https://github.com/jellydn/dapp-starter/"
            >
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </div>
        </footer>
      </Web3ReactProvider>
    </>
  );
};

export default App;
