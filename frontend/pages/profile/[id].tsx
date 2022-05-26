import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import abi from '../../utils/PayloadPortal.json'
import { currentUser } from './../../atoms/currentUserAtom';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import Head from 'next/head';


const Profile = () => {

  const { query: { id } } = useRouter();

  const [allPayloads, setAllPayloads] = useState([]);

  const [currentAccount, setCurrentAccount] = useRecoilState<string>(currentUser);

  const [inputs, setInputs] = useState<{text: string, url: string}>({text: '', url: ''})

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
        const payloadTxn = await payloadPortalContract.payload(currentAccount, inputs.text, inputs.url);
        console.log("Mining...", payloadTxn.hash);

        await payloadTxn.wait();
        console.log("Mined -- ", payloadTxn.hash);

        count = await payloadPortalContract.getTotalPayloads();
        console.log("Retrieved total payload count...", count.toNumber());

        setInputs({text: '', url: ''})

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
    <>

      <Head>
        <title>{id}</title>
        <meta name="description" content={`${id}`} />
        <link rel="icon" href="https://i.ibb.co/Fb3TqKH/to-you-removebg-preview.png" />
      </Head>

      <div className='bg-black min-h-screen text-white md:py-48 py-12'>

        <div className='md:text-3xl text-xl font-bold text-[#ADD8E6] uppercase flex flex-col justify-center items-center'>
            <h1 className='mb-1'>
                {
                    id === currentAccount ? 'Your Profile 😀' : 'Sending to ⤵️'
                }
            </h1>
            <h1 className='md:text-3xl text-sm bg-gray-700 py-2 px-2 rounded-md'>{id}</h1>
        </div>

        {/* Inputs  */}
        <div className="max-w-3xl md:mx-auto ml-3 mr-3 mt-12 flex justify-center flex-col">
          <label className="block mb-2 text-lg font-semibold text-gray-900 dark:text-gray-300">Message📝</label>
          <div className="relative mb-6">
            <input type="text" 
              className="bg-gray-50 font-semibold  text-gray-900 text-sm rounded-lg  block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ring-0" placeholder="U Cute ;)" 
              onChange={(e: any) => inputs.text = e.target.value}/>
          </div>
          <label className="block mb-2 text-lg font-semibold text-gray-900 dark:text-gray-300">Media(Video, Gif, Meme, Image)❤️‍🔥</label>

          <div className="flex">
            <input type="url" 
            className="bg-gray-50 font-semibold  text-gray-900 text-sm rounded-lg  block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ring-0" placeholder="URL" 
            onChange={(e: any) => inputs.url = e.target.value}/>
          </div>
        </div>

        
        <div className='mx-auto flex justify-center mt-2'>
          <button
            type="button"
            className="m-2 rounded px-8 py-2 font-semibold text-gray-700 bg-[#ADD8E6] hover:bg-[#79bad0] text-lg"
            onClick={sendPayload}
          >
            Send
          </button>
        </div>
        {/* <LinkPreview url='https://giphy.com/stories/8-gifs-from-the-2022-uefa-womens-champions-league-final-740cffd3-2338' width='400px' backgroundColor='black' borderColor='#0f172a' primaryTextColor='#94a3b8' /> */}
        
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
    </>
  )
}

export default Profile
