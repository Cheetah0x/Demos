// this is the logic to test to see if a wallet has been coinbase verified

'use client';

//the goal of this page is to get a list of the attestations that a wallet has made 

import React, { useState } from 'react'
import { useEAS } from '../../../Hooks/useEAS';
import { useGlobalState } from '../../../config/config';
import { getAttestationsByCoinbaseVerified } from '../../utils/coinbaseVerified';
import { NetworkType, networkEndpoints } from '../../components/networkEndpoints';




export default function ByAttester() {
    const { eas } = useEAS();

    const [walletAddress] = useGlobalState('walletAddress');
    console.log('walletAddress', walletAddress);
    
    const coinbaseAddress = "0x357458739F90461b99789350868CD7CF330Dd7EE"

    const [Address, setAddress] = useState<string>('');
    const [attestationData, setAttestationData] = useState<any>();
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Sepolia');
    const [isVerified, setIsVerified ] = useState(false);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAddress(value);
        console.log("Address", Address);
    };

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as NetworkType;
        setSelectedNetwork(value);
        console.log("Selected network", value);
    };

    const getAttestationData = async () => {
        try {
            const endpoint = networkEndpoints[selectedNetwork];
            const data = await getAttestationsByCoinbaseVerified(coinbaseAddress, Address, endpoint);
            setAttestationData(data)
            setIsVerified(data && data.length > 0);
        } catch (error) {
            console.log('Error', error);
            setIsVerified(false);
        }
    };
    
    return (

        <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>EAS</h1>
            </div>

            <div className="sm:col-span-4 p-3">
                                    <label htmlFor="network" className="block text-sm font-medium leading-6 text-gray-900">What network would you like to query?</label>
                                    <div className="mt-2">
                                        <select 
                                            id="network" 
                                            name="network"
                                            value={selectedNetwork}
                                            onChange={handleNetworkChange} 
                                            autoComplete="Network" 
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">

                                            <option>Ethereum</option>
                                            <option>Optimism</option>
                                            <option>Linea</option>
                                            <option>Sepolia</option>
                                            <option>Base</option>
                                            <option>Optimism-Goerli</option>
                                            <option>Base-Goerli</option>
                                        </select>
                                    </div>
            </div>

            <div className='p-3'>
                <h3>Type in the Wallet address to see if the Wallet is coinbase verified</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="Attester"
                    value={Address}
                    onChange={handleAddressChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <div className='flex justify-center items-center py-2'>
                <button
                    className='btn items-center'
                    onClick={getAttestationData}
                >Get Attestation Data
                </button>
            </div>

            <div className='flex justify-center items-center py-2'>
                <textarea
                    className="textarea textarea-bordered w-3/5 h-4/5"
                    placeholder="Attestation Data"
                    value={JSON.stringify(attestationData, null, 2)}
                    readOnly
                ></textarea>
            </div>
            <div className='flex justify-center items-center py-2'>
            {isVerified ? <p className="text-green-500">This account is Coinbase verified.</p> : <p className="text-red-500">This account is not Coinbase verified.</p>}
            </div>
        </div>
    )
}
//for the frame, cycle throught the addresses, if one is coinbase verfified then all good
