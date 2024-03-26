'use client';

import React, { useEffect, useState } from 'react';
import { EAS_ADDRESS, SCHEMA, SCHEMA_DETAILS } from '../../config/config';
import { useEAS } from '../../Hooks/useEAS';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';


type AttestationData = {
    Attester: string;
    Message: string,
    ButtonClicked: boolean;
};

//after registering a schema or making an attestation
//refresh app make sure to paste un schema/attestationuid in state variable or else app wont work


export default function Attest() {

    const { eas, schemaRegistry, currentAddress } = useEAS();
    console.log("currentAddress: ", currentAddress);
    console.log("EAS_ADDRESS", EAS_ADDRESS)




    // //State for managing the checkbox
    // //schemaUID is set when you register the schema?!
    // const [schemaUID, setSchemaUID] = useState<string>(
    //     "0x71ba905290b0101f775a21f0566cd76a17e595bb5f8e4020c0aa3043d9bb8802");

    // //if u refresh paste the uid into here from scan
    //const schemaUID = process.env.ATTEST_SCHEMA_UID as string;
    const schemaUID = "0x71ba905290b0101f775a21f0566cd76a17e595bb5f8e4020c0aa3043d9bb8802"
    console.log("SchemaUID: ", schemaUID);
    console.log("EAS: ", eas);

    const [attestationUID, setAttestationUID] = useState<string>("");
    const [attestationData, setAttestationData] = useState<AttestationData>({
        Attester: '',
        Message: '',
        ButtonClicked: false
    });

    const handleAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, value, checked } = e.target;

        setAttestationData({
            ...attestationData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    //shouldnt worry about registering the schema because i did it online
    // const registerSchema = async () => {
    //     if (!schemaRegistry) return;
    //     const transaction = await schemaRegistry.register({
    //         schema: SCHEMA,
    //         resolverAddress: undefined,
    //         revocable: true
    //     })
    //     const uid = await transaction.wait();
    //     console.log('schemaUID', uid)
    //     setSchemaUID(uid);
    // };

    const createAttestation = async () => {
        if (!eas || !schemaUID) return console.error("EAS or SchemaUID not available", eas, schemaUID);
        const schemaEncoder = new SchemaEncoder(SCHEMA);
        console.log({ currentAddress });
        console.log({ message: attestationData.Message });
        console.log({ button: attestationData.ButtonClicked });
        const encodedData = schemaEncoder.encodeData([
            { name: "Attester", value: currentAddress, type: "address" },
            { name: "Message", value: attestationData.Message, type: "string" },
            { name: "ButtonClicked", value: attestationData.ButtonClicked, type: "bool" },
        ]);
        try {
            const transaction = await eas.attest({
                schema: schemaUID,
                data: {
                    recipient: attestationData.Attester,
                    expirationTime: undefined,
                    revocable: true, //Be aware
                    data: encodedData
                }
            });

            const newAttestationUID = await transaction.wait();
            setAttestationUID(newAttestationUID);

            console.log("New attestation UID: ", newAttestationUID);
            console.log("Creating Attestation: ", attestationData);
        } catch (error) {
            console.error("Failed to create attestation: ", error);
        }
    };

    const revokeAttestation = async () => {
        if (!eas) return;
        try {
            const attestation = await eas.getAttestation(attestationUID);

            const transaction = await eas.revoke({
                schema: attestation.schema,
                data: { uid: attestation.uid },
            });
            const receipt = await transaction.wait();
            console.log("Revoking Attestation: ", receipt);
        } catch (error) {
            console.error("Failed to revoke attestation: ", error);
        }
    };

    return (
        <div data-theme='light' className='min-h-screen w-full' >
            <div>
                <h1 className='text-black'>EAS</h1>
            </div>

            <div className='p-3'>
                <h3>Type in your Wallet Address / ENS</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="Attester"
                    value={attestationData.Attester}
                    onChange={handleAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>
            <div className='p-3'>
                <h3>Please input a message!</h3>
                <input
                    type="text"
                    placeholder="Type here"
                    name='Message'
                    value={attestationData.Message}
                    onChange={handleAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>
            <div className="ml-3 text-sm leading-6">
                <input
                    type="checkbox"
                    className="checkbox"
                    id="ButtonClicked"
                    name='ButtonClicked'
                    checked={attestationData.ButtonClicked}
                    onChange={handleAttestationChange}
                />
                <label htmlFor="comments" className=" px-3 font-medium text-gray-900">
                    Tick to get your attestation
                </label>
                <p id="comments-description" className="text-gray-500 py-2">
                    Ticking the box above should allow the user to get an attestation that they ticked the box.
                </p>
            </div>
            <h2 className='flex justify-center items-center py-2'>Get your Attestation</h2>
            <div className='flex justify-center items-center py-2'>
                <button
                    className='btn items-center'
                    onClick={createAttestation}
                >Get your Attestation
                </button>
            </div>
            <h2 className='flex justify-center items-center py-2'>Revoke Attestation</h2>
            <div className='flex justify-center items-center py-2'>

                <button
                    className={`btn items-center`}
                    onClick={revokeAttestation}
                >Revoke Attestation
                </button>
            </div>

        </div>
    )
}

//Old Code
//Function to handle checkbox change
// const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//     console.log('Checkbox state after click:', !isChecked);
// };

// useEffect(() => {
//     console.log('Checked', isChecked ? "checked" : "unchecked");
// }, [isChecked]);

// const handleAttestationClick = () => {
//     if (!isChecked) {
//         alert('Please check the box to proceed.');
//         return;
//     }
//     setIsAttestationStarted(true);
//     //Just simulating the attestation process as a place holder
//     console.log('Attestation process has started...')

//     //Timeout so it doesn't get stuck, 2 seconds
//     setTimeout(() => {
//         setIsAttestationStarted(false);
//         console.log('Attestation process has completed.');
//         alert('Your attestation has been processed!');
//     }, 2000)
// };