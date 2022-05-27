import React, { useEffect, useRef, useState } from 'react'
import abi from '../utils/PayloadPortal.json'
import { useRecoilState } from 'recoil';
import { currentUser } from '../atoms/currentUserAtom';
import Link from 'next/link';
import { NextPage } from 'next';
import TextTransition, { presets } from "react-text-transition";


const TEXTS = [
  "📜 Messages",
  "🔥 GIFs",
  "😆 Memes",
  "🎞️ Videos"
];

const FrontPage: NextPage = () => {

  const [currentAccount, setCurrentAccount] = useRecoilState(currentUser);

  const [index, setIndex] = useState<number>(0);

  const searchRef = useRef<any>(null);

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


  useEffect(() => {
    checkIfWalletIsConnected();

    const intervalId = setInterval(() =>
      setIndex(index => index + 1),
      2000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, [])
  return (
    <section className="py-12 lg:py-20">
        <div className="container mx-auto px-5 text-center">
          <div className="mb-8">
            <div className="space-y-4 mb-12">
              <h4 className="text-2xl sm:text-3xl font-semibold text-[#ADD8E6]">
                To You From Me 💌
              </h4>
              <div className="md:text-5xl text-3xl font-bold text-[#ADD8E6] uppercase flex md:flex-row flex-col justify-center">
                <h1>Send anonymous</h1> 
                <TextTransition
                  text={ TEXTS[index % TEXTS.length] }
                  springConfig={ presets.wobbly }
                  className="mx-auto md:mx-0"
                />
              </div>
            </div>
            {!currentAccount ? (
              <button
                onClick={connectWallet}
                className="px-12 py-4 bg-[#ADD8E6] hover:bg-[#79bad0] transition duration-100 ease-in-out shadow hover:shadow-lg transform hover:scale-110 text-gray-700 font-semibold text-lg rounded-md inline-block"
              >
                Connect Wallet
              </button>
            ) : (
              <Link href={`profile/${currentAccount}`}>
                <button className="px-12 py-4 bg-[#ADD8E6] hover:bg-[#79bad0] transition duration-100 ease-in-out shadow hover:shadow-lg transform hover:scale-110 text-gray-700 font-semibold text-lg rounded-md inline-block">
                    Profile {currentAccount.slice(0, 3)}...{currentAccount.slice(39, 42)}
                </button>
              </Link>
            )}
          </div>
          <img
            className="mx-auto xl:max-w-screen-lg mb-8 w-80"
            src="https://i.ibb.co/Fb3TqKH/to-you-removebg-preview.png"
            alt="Logo"
          />
        </div>

        <div
          className="flex rounded bg-black max-w-[40rem] sm:mx-auto border border-[#ADD8E6] ml-2 mr-2"
        >
          <input
            type="search"
            className="w-full bg-transparent px-4 py-1 text-gray-100 outline-none focus:outline-none"
            placeholder="Wallet Address"
            x-model="search"
            ref={searchRef}
          />

          <Link href={`profile/${searchRef?.current?.value}`}>
            <button
              type="button"
              className="m-2 rounded px-4 py-2 font-semibold text-gray-700 bg-[#ADD8E6] hover:bg-[#79bad0]"
            >
              search
            </button>
          </Link>
        </div>
      </section>
  );
}

export default FrontPage
