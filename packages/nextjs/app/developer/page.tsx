// @ts-ignore
"use client";

import React, { useEffect, useState } from "react";

// @ts-ignore

// @ts-ignore

const DeveloperConsole = () => {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [apiKeys, setApiKeys] = useState<any>([]);

  const [nfts, setNfts] = useState([{ id: 1, name: "Game Pass", supply: 1000, minted: 250, address: "0x123...abc" }]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApiName, setNewApiName] = useState("");
  const [nillionLoading, setNillionLoading] = useState(false);

  //Nillion Vars
  const APP_ID = process.env.NEXT_PUBLIC_NILLION;
  const USER_SEED = "user_123"; // generates a deterministic nillion user id; use any string // TODO : Maybe use developers address. I think its not a security issue.
  const API_BASE = "https://nillion-storage-apis-v0.onrender.com";

  useEffect(() => {
    console.log("\nRetrieving secrets...");
    const fetchKeys = async () => {
      try {
        await retriveKeysNillion();
      } catch (error) {
        console.error("Error retrieving keys:", error);
      }
    };

    fetchKeys(); // Invoke the async function
  }, []);

  const retriveKeysNillion = async () => {
    setNillionLoading(true);
    try {
      const storeids = await fetch(`${API_BASE}/api/apps/${APP_ID}/store_ids`)
        .then(res => res.json())
        .then(data => data.store_ids);

      console.log("\nretrieving secrets...");

      // retrieve first secret
      const secret1 = await fetch(
        `${API_BASE}/api/secret/retrieve/${storeids[0].store_id}?retrieve_as_nillion_user_seed=${USER_SEED}&secret_name=${storeids[0].secret_name}`,
      ).then(res => res.json());
      console.log("first secret retrieved:", secret1);

      // retrieve second secret
      const secret2 = await fetch(
        `${API_BASE}/api/secret/retrieve/${storeids[1].store_id}?retrieve_as_nillion_user_seed=${USER_SEED}&secret_name=${storeids[1].secret_name}`,
      ).then(res => res.json());
      console.log("second secret retrieved:", secret2);

      // update state or process retrieved keys

      setApiKeys([
        { id: 1, name: storeids[0].secret_name, key: secret1.secret || JSON.stringify(secret1) },
        { id: 2, name: storeids[1].secret_name, key: secret2.secret || JSON.stringify(secret2) },
      ]);
    } catch (error) {
      console.error("error retrieving secrets from nillion:", error);
    }
    setNillionLoading(false);
  };

  const generateNewApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: newApiName || "New Key",
      key: `pk_${Math.random().toString(36).substr(2, 9)}`,
      //  environment: "test",
    };
    console.log("Nillion", process.env.NEXT_PUBLIC_NILLION);

    storeInNillion(newKey.name, newKey.key);
    setApiKeys([...apiKeys, newKey]);
    setIsModalOpen(false); // Close modal
    setNewApiName(""); // Reset input
  };

  const storeInNillion = async (name, key) => {
    console.log("\nStoring second secret...");

    setNillionLoading(true);
    const storeResult2 = await fetch(`${API_BASE}/api/apps/${APP_ID}/secrets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: {
          nillion_seed: USER_SEED,
          secret_value: key,
          secret_name: name,
        },
        permissions: {
          retrieve: [],
          update: [],
          delete: [],
          compute: {},
        },
      }),
    }).then(res => res.json());
    console.log("Second secret stored at:", storeResult2);
    setNillionLoading(false);
  };

  const createNewNFT = () => {
    const newNFT = {
      id: nfts.length + 1,
      name: "New Collection",
      supply: 0,
      minted: 0,
      address: `0x${Math.random().toString(36).substr(2, 6)}`,
    };
    setNfts([...nfts, newNFT]);
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-6">Developer Console</h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("api-keys")}
          className={`px-4 py-2 ${activeTab === "api-keys" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          API Keys
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 ${activeTab === "nfts" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          NFTs
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 ${activeTab === "analytics" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "api-keys" && (
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Generate New Key +
              </button>
            </div>

            {nillionLoading ? (
              <h2>Creating your keys...</h2> // Show loading message when nillionLoading is true
            ) : (
              <div className="space-y-4">
                {apiKeys.length > 0 ? (
                  apiKeys.map(apiKey => (
                    <div key={apiKey.id} className="border p-3 rounded-lg">
                      <h3 className="font-medium">{apiKey.name}</h3>
                      <p className="text-sm text-gray-500">{apiKey.environment}</p>
                      <input className="w-full mt-2 bg-gray-100 p-2 border rounded" value={apiKey.key} readOnly />
                    </div>
                  ))
                ) : (
                  <h2>Create your Keys!</h2> // Show "Create your Keys!" message when no keys exist
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "nfts" && (
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">NFT Collections</h2>
              <button onClick={createNewNFT} className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Collection
              </button>
            </div>
            <div className="space-y-4">
              {nfts.map(nft => (
                <div key={nft.id} className="border p-3 rounded-lg">
                  <h3 className="font-medium">{nft.name}</h3>
                  <p className="text-sm text-gray-500">
                    {nft.minted} / {nft.supply} minted
                  </p>
                  <p className="text-sm text-gray-500">Contract: {nft.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-500 text-center">Analytics dashboard coming soon</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Generate New API Key</h3>
            <input
              type="text"
              placeholder="API Key Name"
              value={newApiName}
              onChange={e => setNewApiName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={generateNewApiKey} className="px-4 py-2 bg-blue-500 text-white rounded">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperConsole;
