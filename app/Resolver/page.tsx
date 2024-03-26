'use client';

import React, { useEffect, useState } from 'react';
import { EAS_ADDRESS, RESOLVERSCHEMA } from '../../config/config';
import { useResolver } from '../../Hooks/useResolver';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

//In this file, i am going to try to make attestations on other peoples behalf

type AttestationDataResolver = {
    recipientAttester: string;
    message: string,
    getAttestation: boolean;
};

//TODO: Make the resolver contract : Done

export default function ResolverDemo() {

    const { resolver, currentAddress } = useResolver();
    console.log("Resolver", resolver);
    console.log("current addy", currentAddress);

    //const schemaResolverUID = process.env.RESOLVER_SCHEMA_UID as string;
    const schemaResolverUID = "0x3950136361024077c45224b64ced12bc20c1a2b5546da7cd851466a0ecdb45fd"
    console.log("SchemaResolverUID", schemaResolverUID);


    const [resolverAttestationUID, setResolverAttestationUID] = useState<string>("");
    const [resolverAttestationData, setResolverAttestationData] = useState<AttestationDataResolver>({
        recipientAttester: '',
        message: '',
        getAttestation: false
    });

    const handleResolverAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, checked } = e.target;

        setResolverAttestationData({
            ...resolverAttestationData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const createResolverAttestation = async () => {
        if (!resolver || !schemaResolverUID) return console.error("Resolver or SchemaResolverUID not available", resolver, schemaResolverUID);
        //may have to double check this 
        const schemaEncoder = new SchemaEncoder(RESOLVERSCHEMA);
        console.log({ currentAddress });
        console.log({ message: resolverAttestationData.message })
        console.log({ checkbox: resolverAttestationData.getAttestation });

        const encodedData = schemaEncoder.encodeData([
            { name: "recipientAttestor", value: currentAddress, type: "address" },
            { name: "message", value: resolverAttestationData.message, type: "string" },
            { name: "getAttestation", value: resolverAttestationData.getAttestation, type: "bool" },
        ]);
        try {
            const transaction = await resolver.attest({
                schema: schemaResolverUID,
                data: {
                    recipient: resolverAttestationData.recipientAttester,
                    expirationTime: undefined,
                    revocable: true, //TODO: implement revocation
                    data: encodedData
                }
            });

            const newResolverAttestationUID = await transaction.wait()
            setResolverAttestationUID(newResolverAttestationUID);

            console.log("New attestation UID: ", newResolverAttestationUID);
            console.log("Creating Attestation: ", resolverAttestationData);
        } catch (error) {
            console.error("Failed to create attestation: ", error);
        }
    };

    const revokeResolverAttestation = async () => {
        if (!resolver) return;
        try {
            const attestation = await resolver.getAttestation(resolverAttestationUID);

            const transaction = await resolver.revoke({
                schema: attestation.schema,
                data: { uid: attestation.uid },
            });
            const receipt = await transaction.wait();
            console.log("Revoking Attestation: ", receipt);
        } catch (error) {
            console.error("Failed to revoke attestation: ", error);
        }
    }

    return (
        <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>Resolver Contract Demo</h1>
            </div>
            <p>The logic is there will be a wallet address that is only allowed to make attestations to the specific schema</p>

            <div className='p-3'>
                <h3>Owner of the schema</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="SchemaOwner"
                    //value={resolverAttestationData}
                    //onChange={handleResolverAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
                <p>This contract is the owner of this schema ... ie, test address, can be empty in this demo</p>
            </div>

            <div className='p-3'>
                <h3>Type in you wallet address / ENS</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="recipientAttester"
                    value={resolverAttestationData.recipientAttester}
                    onChange={handleResolverAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
                <p>The owner of the schema will make the attestation on behalf of this wallet</p>
            </div>


            <div className='p-3'>
                <h3>Please input a message!</h3>
                <input
                    type="text"
                    placeholder="Type here"
                    name='message'
                    value={resolverAttestationData.message}
                    onChange={handleResolverAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <h2 className='flex justify-center items-center py-2'>Get your Attestation</h2>

            <div className='flex justify-center items-center py-2'>
                <button
                    className='btn items-center'
                    onClick={createResolverAttestation}
                >Get your Attestation
                </button>
            </div>
        </div>
    )
}
//TODO: Add revoking button and logic

