import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return { provider, signer };
};