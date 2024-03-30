'use client';

import React, { useState } from 'react'
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { EAS_ADDRESS } from '../../config/config';
import { getDefaultProvider } from 'ethers';
import { useEAS } from '../../Hooks/useEAS';
import { useGlobalState } from '../../config/config';
import { ethers } from 'ethers';


//0xb8b7f9c2383d829ba60d2d0042c9e6f8a13cfd666d7548012e9c89fb69e69630
//UID of my first attestation

export default function Fetch() {
    const { eas } = useEAS();

    const [walletAddress] = useGlobalState('walletAddress');
    console.log('walletAddress', walletAddress);

    const [UID, setUID] = useState<string>('');
    const [attestationData, setAttestationData] = useState<any>();

    const handleUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUID(value);
        console.log("UID", UID);
    };



    const getAttestationData = async () => {

        const attestation = await eas.getAttestation(UID);
        console.log(attestation);
        setAttestationData(attestation);
    };

    return (

        <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>EAS</h1>
            </div>

            <div className='p-3'>
                <h3>Type in the UID of the attestation you would like.</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="Attester"
                    value={UID}
                    onChange={handleUIDChange}
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
                    value={attestationData ? `UID: ${attestationData.uid}
                                            Schema: ${attestationData.schema}
                                            Recipient: ${attestationData.recipient}
                                            Attester: ${attestationData.attester}
                                            Data: ${attestationData.data}` : ''}
                    readOnly
                ></textarea>
            </div>
        </div>
    )
}
