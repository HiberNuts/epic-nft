import "./styles/App.css";
import React, { useEffect, useState } from "react";
import githubLogo from "./assets/icons8-github.svg";
import { ethers } from "ethers";
import MyEpicNFT from "./utils/MyEpicNFT.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Constants
const TWITTER_LINK = "https://github.com/HiberNuts";
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  toast.configure();
  const [CurrentAccount, setCurrentAccount] = useState("");

  // Render Methods
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x682baC51DbBA471E26731A7667515FE821872EB2";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      }
    } catch (error) {
      toast.error("Error occured try again");
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">Each unique. Each beautiful. Discover your NFT today.</p>
          {CurrentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div style={{ backgroundColor: "white", zIndex: 100 }} className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={githubLogo} />
          <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">
            built by HiberNuts
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
