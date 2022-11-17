import { useEffect, useState } from 'react';
import Web3 from "web3";
import './App.css';

function App() {
  const [networkName, setNetworkName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [web3Instance, setWeb3Instance] = useState();

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress])

  useEffect(() => {
    getNetworkName();
    window.ethereum.on('networkChanged', (networkId) => {
      getNetworkName()
    })
  }, [web3Instance])

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0] || "");
      });
    } else {
      setWalletAddress("");
      setWeb3Instance()
    }
  }

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
          setWalletAddress(accounts[0]);
          const web3 = new Web3(window.ethereum);
          setWeb3Instance(web3);
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    else alert('Install Meta Mask first!');
  }

  const getNetworkName = async () => {
    if (!web3Instance) return;
    const response = await web3Instance.eth.net.getNetworkType();
    setNetworkName(response);
  }

  const handleConnect = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        const web3 = new Web3(window.ethereum);
        setWeb3Instance(web3);
      } catch (error) {
        console.log(error.message)
      }
    }
    else alert('Install Meta Mask first!');
  }

  return (
    <div className="App">
      {walletAddress.length ? <div>
        <p>Connected: {walletAddress}</p>
        <h3>Network Name: {networkName}</h3>
      </div> :
        <button onClick={handleConnect}>Connect to Meta Mask</button>
      }
    </div>
  );
}

export default App;
