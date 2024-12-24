import { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { Signer } from "@lens-network/sdk/ethers";
import abi from '../../../contractsv1/artifacts/contracts/BookIt.sol/BookIt.json';

const CONTRACT_ADDRESS = "0x4dfE55D19853E50bef97Ef7d0D710F774A416403";

export function useContract(provider) {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (provider) {
          const network = await provider.getNetwork();
          const newSigner = Signer.from(
            await provider.getSigner(),
            Number(network.chainId),
            provider
          );
          const address = await newSigner.getAddress();
          setSigner(newSigner);
          setAddress(address);
          setContract(new Contract(CONTRACT_ADDRESS, abi, newSigner));
        }
      } catch (err) {
        setError(err.message);
        console.error('Contract initialization error:', err);
      }
    };
    initContract();
  }, [provider]);

  return { contract, signer, address, error };
}