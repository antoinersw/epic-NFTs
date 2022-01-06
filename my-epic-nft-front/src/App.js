import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = "0xProudFrog";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x13E1684Ec11E8Fa51C1688C0e6f7F24D11d0535E";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countNFTs, setCountNFTs] = useState(0);
  const [NFTcollection, setCollection] = useState([])

  let myHeaders = new Headers();

  let myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };
  const getNfts = async () => {
    const get = await fetch(
      "https://api.opensea.io/api/v1/collection/doodles-official",
      myInit
    ).then(function (res) {
      return res.json();
    });

    const collection = await get.collection;
    setCollection([collection])
    console.log(NFTcollection)
    return [collection];
  };


  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("get Metamask");
    } else {
    }

    /*
     * Check if we're authorized to access the user's wallet
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });

    /*
     * User can have multiple authorized accounts, we grab the first one if its there!
     */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);

      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      } else if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    setCurrentAccount("");
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          console.log(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setIsLoading(true);

        console.log("Mining...please wait.");

        await nftTxn.wait();

        setIsLoading(false);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCountNFTs = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        const count = await connectedContract.getTotalNumberOfNFTs();

        setCountNFTs(count.toNumber());
      } else {
        alert("Get metamask app");
      }
    } catch (error) {
      console.log(error.message, error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getCountNFTs();
    getNfts()
  }, []);

  return (
    <>
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header gradient-text">My NFT Collection</p>
            <p className="sub-text">
              Each unique. Each beautiful. Your NFTs awaits you !
            </p>
            <p className="sub-text">Already {countNFTs} have been minted.</p>

            {!currentAccount ? (
              <button
                className="cta-button connect-wallet-button"
                onClick={connectWallet}
              >
                Connect to Wallet
              </button>
            ) : (
              <>
                <button
                  className="cta-button connect-wallet-button"
                  onClick={disconnectWallet}
                >
                  Wallet connected
                </button>
                <button
                  onClick={askContractToMintNft}
                  className="cta-button connect-wallet-button"
                >
                  Mint NFT
                </button>
                <button onClick={getNfts}>get</button>
                <div>
                  {NFTcollection.map(e=>(
                    <>
                    <p className="sub-text">{e.name}</p>
                    {/* <p className="sub-text">{e}</p> */}
                    </>
                  ))}
                </div>
              </>
            )}
            {isLoading ? <h1 className="sub-text">Mining...</h1> : null}
          </div>
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
