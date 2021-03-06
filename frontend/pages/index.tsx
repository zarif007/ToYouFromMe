import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentUser } from '../atoms/currentUserAtom';
import FrontPage from '../components/FrontPage';



const Home: NextPage = () => {

  const [currentAccount, setCurrentAccount] = useRecoilState<string>(currentUser);

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


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className={`bg-black min-h-screen`}>
      <Head>
        <title>To You From Me</title>
        <meta name="description" content="Send anonymous" />
        <link rel="icon" href="/logo.ico" />
      </Head>

      {/* Banner  */}
      <FrontPage />
    </div>
  );
}

export default Home
