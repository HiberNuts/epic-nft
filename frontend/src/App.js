import "./styles/App.css";
import React, { useEffect, useState } from "react";
import githubLogo from "./assets/icons8-github.svg";
import { ethers } from "ethers";
import MyEpicNFT from "./utils/MyEpicNFT.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Audio } from "react-loader-spinner";

// Constants
const GITHUB_LINK = "https://github.com/HiberNuts/epic-nft";
const OPENSEA_LINK = "https://testnets.opensea.io/collection/raghavnft";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  toast.configure();
  const [CurrentAccount, setCurrentAccount] = useState("");
  const CONTRACT_ADDRESS = "0xA8aD93756013Ac29C971576ac9670933C2f16E98";
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
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

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      toast.warning("You are not connected to the Rinkeby Test Network!");
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

      setupEventListener();
    } catch (error) {
      console.log(error);
      toast.error("Error while connecting to th wallet.");
    }
  };

  const setupEventListener = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          // toast.info(
          //   `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          // );
          // alert(
          //   `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          // );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in listening for events");
    }
  };

  const askContractToMintNft = async () => {
    try {
      setloading(true);
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT({ gasLimit: 1000000 });

        console.log("Mining...please wait.");
        await nftTxn.wait();
        setloading(false);
        setsuccess(true);
        setInterval(() => {
          setsuccess(false);
        }, 10000);
        setsuccessMessage(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        toast.success("Horah! You have minted a NFT!! 🎉", { autoClose: 7000 });
      }
    } catch (error) {
      setsuccess(false);
      setloading(false);
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
          ) : loading ? (
            <div style={{ display: "flex", align: "center", justifyContent: "center", alignItems: "center" }}>
              <Audio
                height="100"
                style={{ align: "center", justifyContent: "center", alignItems: "center" }}
                width="100"
                color="white"
                ariaLabel="loading"
              />
            </div>
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
          {success ? <p className="subtext">{successMessage}</p> : ""}
          <p className="sub-text">
            Have a look at all of our NFT's... here -&gt;
            <a target="_blank" href="https://testnets.opensea.io/collection/raghavnft">
              Open Sea
            </a>
          </p>
        </div>
        <div style={{ backgroundColor: "white", zIndex: 100 }} className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={githubLogo} />
          <a className="footer-text" href={GITHUB_LINK} target="_blank" rel="noreferrer">
            built by HiberNuts
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
