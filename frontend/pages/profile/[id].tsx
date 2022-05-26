import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import abi from '../../utils/PayloadPortal.json'
import { currentUser } from './../../atoms/currentUserAtom';

const Profile = () => {

  const { query: { id } } = useRouter();

  const [allPayloads, setAllPayloads] = useState([]);

  const [currentAccount, setCurrentAccount] = useRecoilState<string>(currentUser);

  const contractAddress = "0xD3E56888702C07D46BFa44570F00F7B373491573";

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
       console.log(currentAccount)
        const payloadTxn = await payloadPortalContract.payload(currentAccount, "kire", "dsdsadsa");
        console.log("Mining...", payloadTxn.hash);

        await payloadTxn.wait();
        console.log("Mined -- ", payloadTxn.hash);

        count = await payloadPortalContract.getTotalPayloads();
        console.log("Retrieved total payload count...", count.toNumber());

        getAllPayloads()
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
            sender: payload.sender,
            to: payload.reciever,
            timestamp: new Date(payload.timestamp * 1000),
            text: payload.text,
            url: payload.url,
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
    getAllPayloads();
  }, [])

  return (
    <div className='bg-black min-h-screen text-white py-48'>
      <div className='md:text-3xl text-xl font-bold text-[#ADD8E6] uppercase flex flex-col justify-center items-center'>
          <h1>
              {
                  id === currentAccount ? 'Your Profile' : 'Sending to ⤵️'
              }
            </h1>
          <h1>{id}</h1>
      </div>
      {
          allPayloads.map((p: any, index) => {
              return (
                <h1 key={index} className='md:text-3xl text-xl font-bold text-[#ADD8E6] uppercase flex flex-col justify-center items-center'>
                    {p.text}
                </h1>
              )
          })
      }
      {
        (currentAccount !== undefined || '') && <button onClick={sendPayload} >send</button>
      }
    </div>
  )
}

export default Profile
