import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import abi from '../utils/PayloadPortal.json'

const FrontPage = () => {


  const [currentAccount, setCurrentAccount] = useState("");

  const [allPayloads, setAllPayloads] = useState([]);

  const contractAddress = "0x64FE5a971EDB3497EC2610B1A3fEbA72bb1DCcC7";

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
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
      console.log(error)
    }
  }

  const sendPayload = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const payloadPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await payloadPortalContract.getTotalPayloads();
        console.log("Retrieved total payload count...", count.toNumber());

        /*
        * Execute the actual payload from your smart contract
        */
        const payloadTxn = await payloadPortalContract.payload("kire", "dsdsadsa");
        console.log("Mining...", payloadTxn.hash);

        await payloadTxn.wait();
        console.log("Mined -- ", payloadTxn.hash);

        count = await payloadPortalContract.getTotalPayloads();
        console.log("Retrieved total payload count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllPayloads = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const payloadPortalContract = new ethers.Contract(contractAddress, contractABI, signer);


        const payloads = await payloadPortalContract.getAllPayloads();

        let payloadsCleaned: any = [];
        payloads.forEach((payload: any) => {
          payloadsCleaned.push({
            address: payload.sender,
            timestamp: new Date(payload.timestamp * 1000),
            text: payload.text,
            ulr: payload.url,
          });
        });

        /*
         * Store our data in React State
         */
        setAllPayloads(payloadsCleaned);

        console.log(payloadsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <>
      {!currentAccount && (
          <button className="" onClick={connectWallet}>
            Connect Wallet
          </button>
       )}
       
       <button onClick={() => {
           sendPayload();
           getAllPayloads();
       }}>Send</button>

       <p>{allPayloads.length}</p>
    </>
  )
}

export default FrontPage
