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


  const contractAddress = "0x64FE5a971EDB3497EC2610B1A3fEbA72bb1DCcC7";

  const contractABI = abi.abi;


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
    </div>
  )
}

export default Profile
