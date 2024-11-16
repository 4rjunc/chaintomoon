"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, CubeIcon, CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [proof, setProof] = useState("");

  const onSuccess = () => {
    // This is where you should perform any actions after the modal is closed
    // Such as redirecting the user to a new page
    console.log("World Coin Success");
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="flex justify-center items-center text-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 relative">
              <Image alt="SE2 logo" className="cursor-pointer" layout="fill" src="/mushroom.png" />
            </div>
            <span className="text-4xl font-bold">ChainPortal</span>
          </h1>

          <div className="flex justify-center items-center text-center space-x-4">
            {proof ? (
              <div>
                <div className="flex justify-center items-center space-x-2 flex-col">
                  <p className="my-2 font-medium">Connected Address:</p>
                  <Address address={connectedAddress} />
                  <Link
                    href="/developer"
                    passHref
                    className={`
                   mt-3 bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
                  >
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                    <span>Developer Console</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <IDKitWidget
                  app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID} // obtained from the Developer Portal
                  action="profezzor" // obtained from the Developer Portal
                  onSuccess={setProof} // callback when the modal is closed
                  signal={connectedAddress} // proof will only verify if the signal is unchanged, this prevents tampering
                  verification_level={VerificationLevel.Device}
                >
                  {({ open }) => (
                    // This is the button that will open the IDKit modal
                    <button onClick={open} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Verify with World ID to unlock access
                    </button>
                  )}
                </IDKitWidget>
              </div>
            )}
          </div>

          <p className="text-center text-lg">
            <h2>Connect. Play. Own</h2>
          </p>

          <p className="text-center text-lg">
            Build better gaming experiences with{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              plug-and-play authentication
            </code>{" "}
            powered by{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              blockchain technology
            </code>
          </p>
        </div>

        {/*<div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <CurrencyDollarIcon className="h-8 w-8 fill-secondary" />

              <h3 className="text-lg font-bold mt-4 mb-2">True Ownership</h3>
              <p>
                Players can freely trade or sell their gaming accounts as NFTs on any marketplace <br></br>
                <Link href="/debug" passHref className="link">
                  {" "}
                  {/* TODO: Change the path to market place*/}
                  Explore Marketplace
                </Link>{" "}
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <CubeIcon className="h-8 w-8 fill-secondary" />

              <h3 className="text-lg font-bold mt-4 mb-2">Secure Identity</h3>
              <p>
                Every player account is secured by blockchain technology and verified through NFTs <br></br>
                <Link href="/blockexplorer" passHref className="link">
                  {" "}
                  {/* TODO: Path to docs*/}
                  Learn How
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
