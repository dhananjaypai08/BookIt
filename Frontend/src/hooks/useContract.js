// src/hooks/useContract.js
import { useEffect, useState } from 'react';
import { Contract, JsonRpcProvider, BrowserProvider } from 'ethers';
import { Signer } from "@lens-network/sdk/ethers";
import { useAccount, useWalletClient } from 'wagmi';
import abi from '../../../contractsv1/artifacts/contracts/BookIt.sol/BookIt.json';

const CONTRACT_ADDRESS = "0x1e9A38b7C8f2eaefDA1E73D6aCFAbF9149F58657";
const LENS_SEPOLIA_CHAIN_ID = 37111;

export function useContract() {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (isConnected && walletClient && address) {
                try {
                    // Create Signer from walletClient
                    // const signer = Signer.from(
                    //     walletClient,
                    //     LENS_SEPOLIA_CHAIN_ID,
                    //     new JsonRpcProvider("https://rpc.testnet.lens.dev")
                    // );
                    const provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    setSigner(signer);
                    console.log(signer, provider);
                    // Create contract instance with signer
                    const contractInstance = new Contract(
                        CONTRACT_ADDRESS,
                        abi.abi,
                        provider
                    );
                    const connectedcontract = contractInstance.connect(signer);

                    setContract(contractInstance);
                } catch (error) {
                    console.error('Error initializing contract:', error);
                    setContract(null);
                }
            } else {
                setContract(null);
            }
        };

        initContract();
    }, [isConnected, walletClient, address]);

    return { contract, address, isConnected, signer };
}