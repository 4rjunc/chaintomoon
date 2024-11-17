"use client";

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable no-console */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RPC from "./ethersRPC";
import { CHAIN_NAMESPACES, IAdapter, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { CubeIcon, CurrencyDollarIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftOnRectangleIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  UserCircleIcon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://base-sepolia.blockscout.com/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: any = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
};
const web3auth = new Web3Auth(web3AuthOptions);

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
adapters.forEach((adapter: IAdapter<unknown>) => {
  web3auth.configureAdapter(adapter);
});

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { address: connectedAddress } = useAccount();
  const [proof, setProof] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      getAccounts();
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    setAddress(address);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...", provider);
    // Convert 1 ether to WEI format
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* User Info Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-gray-500 font-medium">Connected Address</p>
                <Address address={address} size="3xl" />
              </div>

              <Link
                href="/developer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <CubeIcon className="h-5 w-5" />
                <span>Play the game!</span>
              </Link>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "User Info", icon: UserCircleIcon, action: getUserInfo, color: "from-pink-500 to-rose-500" },
              { label: "Accounts", icon: WalletIcon, action: getAccounts, color: "from-purple-500 to-indigo-500" },
              { label: "Balance", icon: CurrencyDollarIcon, action: getBalance, color: "from-blue-500 to-cyan-500" },
              {
                label: "Sign Message",
                icon: PencilSquareIcon,
                action: signMessage,
                color: "from-teal-500 to-green-500",
              },
              {
                label: "Send Transaction",
                icon: PaperAirplaneIcon,
                action: sendTransaction,
                color: "from-amber-500 to-orange-500",
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`
              flex items-center justify-center gap-3 p-4
              bg-gradient-to-r ${item.color}
              text-white font-medium rounded-xl
              hover:scale-105 transition-all duration-200
              shadow-lg
            `}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center justify-center gap-3 p-4
            bg-gradient-to-r from-red-500 to-pink-500
            text-white font-medium rounded-xl
            hover:scale-105 transition-all duration-200
            shadow-lg"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>

          {/* Console Output */}
          <div className="mt-8 bg-gray-900 rounded-xl p-4 shadow-inner">
            <div className="font-mono text-sm text-gray-300 overflow-x-auto">
              <div id="console">
                <p></p>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );

  const unloggedInView = (
    <button
      onClick={login}
      className="px-8 py-3 border-2 border-purple-500 text-purple-500 font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300"
    >
      Connect & Play
    </button>
  );

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div>
        <div className="px-5">
          <h1 className="flex justify-center items-center text-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 relative">
              <Image alt="SE2 logo" className="cursor-pointer" layout="fill" src="/mushroom.png" />
            </div>
            <span className="text-4xl font-bold">Chain2Moon</span>
          </h1>

          {/* Tagline */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              <span className="text-purple-600">Connect.</span> <span className="text-blue-500">Play.</span>{" "}
              <span className="text-green-500">Own.</span>
            </h2>
          </div>

          {/* Description */}

          <p className="text-center text-xl mb-8 max-w-2xl mx-auto">
            Take control of your finances with{" "}
            <code className="px-2 py-1 rounded-md bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold">
              smart staking solutions
            </code>{" "}
            that help you{" "}
            <code className="px-2 py-1 rounded-md bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 font-semibold">
              save and grow your money
            </code>{" "}
            effortlessly.
          </p>

          <div className="flex justify-center items-center text-center space-x-4 mb-12">
            {loggedIn ? loggedInView : unloggedInView}
          </div>

          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID} // obtained from the Developer Portal
            action="profezzor" // obtained from the Developer Portal
            onSuccess={setProof} // callback when the modal is closed
            signal={connectedAddress} // proof will only verify if the signal is unchanged, this prevents tampering
            verification_level={VerificationLevel.Device}
          >
            {({ open }: { open: () => void }) => (
              // This is the button that will open the IDKit modal
              <button onClick={open} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Verify with World ID to unlock access
              </button>
            )}
          </IDKitWidget>

          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />

                <h3 className="text-lg font-bold mt-4 mb-2">Grow Your Savings</h3>
                <p>
                  Stake your funds securely and earn attractive yields over time. Make saving effortless and rewarding.{" "}
                  <br></br>
                  <Link href="/learn" passHref className="link">
                    {" "}
                    {/* TODO: Update the path to the savings guide*/}
                    Learn More
                  </Link>{" "}
                </p>
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <CubeIcon className="h-8 w-8 fill-secondary" />

                <h3 className="text-lg font-bold mt-4 mb-2">Secure and Transparent</h3>
                <p>
                  Your savings are backed by blockchain technology, ensuring security, transparency, and complete
                  control over your funds. <br></br>
                  <Link href="/docs" passHref className="link">
                    {" "}
                    {/* TODO: Update the path to the documentation*/}
                    Read Documentation
                  </Link>{" "}
                  Contracts
                  <ul>
                    <li>
                      <Link href="https://base-sepolia.blockscout.com/address/0x74b8c21F230C168de61451ED79dfDE2FCE83911f#code">
                        Contract 1
                      </Link>
                    </li>

                    <li>
                      <Link href="https://eth.blockscout.com">contract 2</Link>
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
<div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
<div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      */}
    </div>
  );
}

export default App;
