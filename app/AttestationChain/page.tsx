'use client';

import React, { useState } from 'react';
import { NetworkType, networkEndpoints } from '../components/networkEndpoints';
import { fetchAttestationChain } from '../api/fetchAttestationChain/route';
import { useGlobalState } from '../../config/config';

export default function AttestationChain() {
  const [ selectedNetwork, setSelectedNetwork] = useState<NetworkType>('Sepolia');
  const [uid, setUid] = useState<string>('');
  const [attestationChain, setAttestationChain] = useState<any[] | null>(null);

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NetworkType;
    setSelectedNetwork(value);
    console.log('Selected Network', value);
  };


  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUid(value);
    console.log('UID', value);
  };

  const fetchChain = async () => {
    try {
      const endpoint = networkEndpoints[selectedNetwork];
      const chain = await fetchAttestationChain(uid, endpoint);
      setAttestationChain(chain);
      console.log('Attestation chain fetched successfully:', chain);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>EAS</h1>
            </div>

            <div className="sm:col-span-4 p-3">
                                    <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">What network would you like to query?</label>
                                    <div className="mt-2">
                                        <select 
                                            id="chain" 
                                            name="chain"
                                            value={selectedNetwork}
                                            onChange={handleNetworkChange} 
                                            autoComplete="Chain" 
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                            {Object.keys(networkEndpoints).map((network) => (
                                            <option key={network} value={network}>
                                                {network}
                                            </option>
                                            ))}
                                        </select>
            </div>

            <div className='p-3'>
                <h3>Type in the UID</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="Attester"
                    value={uid}
                    onChange={handleUidChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <div className='flex justify-center items-center py-2'>
                <button
                    className='btn items-center'
                    onClick={fetchChain}
                >Get Attestation Data
                </button>
            </div>

            <div className="flex justify-center items-center py-2">
                {attestationChain && (
                    <textarea
                        className="textarea textarea-bordered w-3/5 h-4/5"
                        placeholder="Attestation Data"
                        value={JSON.stringify(attestationChain, null, 2)}
                        readOnly
                    ></textarea> )}
            </div>

            </div>
    </div>
    </>
  );
}