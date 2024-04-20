'use client';

import React, { useState } from 'react'
import { useEAS } from '../../../Hooks/useEAS';
import { useGlobalState } from '../../../config/config';
import Link from 'next/link';


//added logic in here so that you can only see the page if you have logged in.


export default function Fetch() {
    const { eas } = useEAS();

    const [walletAddress] = useGlobalState('walletAddress');
    const [fid] = useGlobalState('fid')
    console.log('walletAddress', walletAddress);
    console.log('Fid', fid)

    const [UID, setUID] = useState<string>('');
    const [attestationData, setAttestationData] = useState<any>();

    const handleUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUID(value);
        console.log("UID", UID);
    };



    const getAttestationData = async () => {
        if(!eas) {
            console.log('Eas not initialised yet.');
            return;
        }
        try {
            const attestation = await eas.getAttestation(UID);
            console.log(attestation);
            setAttestationData(attestation);
        }catch (error) {
            console.error('Error', error);
        }
    };

    if (!fid) {
        // Render the login card if fid is empty
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Login Required</h2>
                        <p>You must be logged in to view this page.</p>
                        <div className="card-actions justify-end">
                            <Link href="/login">
                                <button className="btn btn-primary">Go to login</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (



        <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>EAS</h1>
            </div>

            <div className='p-3'>
                <h3>This demo is linked to getting attestations from sepolia.</h3>
                <p> User Fid: {fid}</p>
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
