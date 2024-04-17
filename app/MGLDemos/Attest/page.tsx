"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { EAS_ADDRESS, SCHEMA, SCHEMA_DETAILS, BACKEND_DELEGATED_URL } from "../../../config/config";
import {
  useEAS,
  AttestationNetworkType,
  networkContractAddresses,
} from "../../../Hooks/useEAS";
import {
  SchemaEncoder,
  EAS,
  Delegated,
  EIP712AttestationParams,
  DelegatedProxy,
} from "@ethereum-attestation-service/eas-sdk";
//import ReCAPTCHA from 'react-google-recaptcha';
import { ethers, keccak256 } from "ethers";


type AttestationData = {
  Attester: string;
  Message: string;
  refUID: string;
  ButtonClicked: boolean;
};

//after registering a schema or making an attestation
//refresh app make sure to paste un schema/attestationuid in state variable or else app wont work

export default function Attest() {
  const {
    eas,
    schemaRegistry,
    currentAddress,
    selectedNetwork,
    handleNetworkChange,
  } = useEAS();


  //const schemaUID ="0x71ba905290b0101f775a21f0566cd76a17e595bb5f8e4020c0aa3043d9bb8802";

  //for OP
  const schemaUID = "0x71ba905290b0101f775a21f0566cd76a17e595bb5f8e4020c0aa3043d9bb8802"
  console.log("SchemaUID: ", schemaUID);
  console.log("EAS: ", eas);

  const [captcha, setCaptcha] = useState<string | null>("");
  const [attestationUID, setAttestationUID] = useState<string>("");
  const [attestationData, setAttestationData] = useState<AttestationData>({
    Attester: "",
    Message: "",
    refUID: "",
    ButtonClicked: false,
  });

  const handleAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    setAttestationData({
      ...attestationData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNetworkChangeEvent = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value as AttestationNetworkType;
    handleNetworkChange(selectedValue);
    console.log("Selected Network", selectedValue);
  };

  //Captcha logic
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Captcha value:", captcha);
    if (captcha) {
      console.log("Captcha is valid");
    }
  };

  const createAttestation = async () => {
    //check for captcha being solved
    // if (!captcha) {
    //     alert("Please complete the captcha to continue");
    //     return;//exit function if captcha not solved
    // }

    if (!eas || !schemaUID)
      return console.error("EAS or SchemaUID not available", eas, schemaUID);

    const schemaEncoder = new SchemaEncoder(SCHEMA);
    console.log({ currentAddress });
    console.log({ message: attestationData.Message });
    console.log({ refUID: attestationData.refUID });
    console.log({ button: attestationData.ButtonClicked });

    const encodedData = schemaEncoder.encodeData([
      { name: "Attester", value: currentAddress, type: "address" },
      { name: "Message", value: attestationData.Message, type: "string" },
      {
        name: "ButtonClicked",
        value: attestationData.ButtonClicked,
        type: "bool",
      },
      //this is only data related to the schema, the refUID is referenced in the transaction
    ]);
    try {
      const transaction = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: attestationData.Attester,
          expirationTime: undefined,
          refUID: attestationData.refUID,
          revocable: true, //Be aware
          data: encodedData,
        },
      });

      const newAttestationUID = await transaction.wait();
      setAttestationUID(newAttestationUID);

      console.log("New attestation UID: ", newAttestationUID);
      console.log("Creating Attestation: ", attestationData);

      //reset the captcha
      setCaptcha(null);
    } catch (error) {
      console.error("Failed to create attestation: ", error);
    }
  };

  //i need to get one account to sign the transaction, the other party to sign to the blockchain
  //need a button for one wallet to sign,
  //when u press the delegate button, the payer pays for it
  //sign typed data with viem
  //maybe sign the data field in attest

  //send signed to backend
  //bakend has private key and auto signs it
  //signature to backend

  const delegateAtetstation = async () => {
    // //check for captcha being solvedß
    // if (!captcha) {
    //     alert("Please complete the captcha to continue");
    //     return;//exit function if captcha not solved
    // }
    //const eas1 = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

    //for OP
    
    if (!eas || !schemaUID)
      return console.error("EAS or SchemaUID not available", eas, schemaUID);

    
    //can add in logic to change this for other networks

    const schemaEncoder = new SchemaEncoder(SCHEMA);
    console.log({ currentAddress });
    console.log({ message: attestationData.Message });
    console.log({ refUID: attestationData.refUID });
    console.log({ button: attestationData.ButtonClicked });

    const encodedData = schemaEncoder.encodeData([
      { name: "Attester", value: currentAddress, type: "address" },
      { name: "Message", value: attestationData.Message, type: "string" },
      {
        name: "ButtonClicked",
        value: attestationData.ButtonClicked,
        type: "bool",
      },
      //this is only data related to the schema, the refUID is referenced in the transaction
    ]);

    //this is still getting the signer through metamask, not really needed
    const provider = await new ethers.BrowserProvider(window.ethereum);
    console.log("Provider: ", provider);

    const signer = await provider.getSigner();
    console.log("Signer obtained: ", signer);

    // let transactionCount = await provider.getTransactionCount(attestationData.Attester) + 1 ;
    // console.log("Transaction Count: ", transactionCount);

    //const eas = new EAS("0x4200000000000000000000000000000000000021");
    eas.connect(signer);
    const delegatedSigner = await eas.getDelegated();
    console.log("Delegated Signer: ", delegatedSigner);


    //address is sepolia eas address, now op
    //complicated version below

    // const partialTypedData = {
    //     name: "EAS",
    //     //address: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    //     address: eas1,
    //     version: "1.0.1",
    //     //chainId: BigInt(11155111),
    //     chainId: BigInt(10),

    // };

    // const delegatedSignedHandler = await new Delegated(partialTypedData);
    const easnonce = await eas.getNonce(attestationData.Attester);

    const attestation: EIP712AttestationParams = {
      schema: schemaUID,
      recipient: attestationData.Attester,
      expirationTime: BigInt(9673891048),
      revocable: true,
      refUID: attestationData.refUID,
      //data: Buffer.from(encodedData.slice(2), "hex"), // we place a hash of signed data in here
      data: encodedData,
      value: BigInt(0),
      deadline: BigInt(9673891048),
      nonce: easnonce
    };
    console.log("Attestation: ", { ...attestation });

    
    try {
        //   const signDelegated = await delegatedSignedHandler.signDelegatedAttestation(
        //       attestation,
        //       signer,
        //     );
        //easier version
        const signDelegated = await delegatedSigner.signDelegatedAttestation(attestation, signer);

        console.log("delegated transaction ", signDelegated);

        // replace with the original data after we get the signature
        attestation.data = encodedData;

        const signature = signDelegated.signature;
        console.log("Signature: ", signature);

        const dataToSend = {
            ...attestation,
            signature: signature,
            attester: currentAddress,
        };

        const serialisedData = JSON.stringify(dataToSend, (key, value) =>
            typeof value === "bigint" ? "0x" + value.toString(16) : value
        );
        console.log("Serialised Data: ", serialisedData);



        const response = await fetch(
            `${BACKEND_DELEGATED_URL}/signDelegatedAttestation`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: serialisedData,
            }
        );
        const data = await response.json();
        } catch (error) {
        console.error("Error signing delegated attestation: ", error);
        }
  };

  // const revokeAttestation = async (eas:any) => {
  //     if (!eas) return;
  //     try {
  //         const attestation = await eas.getAttestation(attestationUID);

  //         const transaction = await eas.revoke({
  //             schema: attestation.schema,
  //             data: { uid: attestation.uid },
  //         });
  //         const receipt = await transaction.wait();
  //         console.log("Revoking Attestation: ", receipt);
  //     } catch (error) {
  //         console.error("Failed to revoke attestation: ", error);
  //     }
  // };

  return (
    <div data-theme="light" className="min-h-screen w-full">
      <div>
        <h1 className="text-black">EAS, only works for sepolia</h1>
        <h2 className="text-black">
          Going to try to get the Delegate attestation logic working here.
        </h2>
      </div>

      <div className="p-3">
        <label
          htmlFor="chain"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Select Attestation Network
        </label>
        <div className="mt-2">
          <select
            id="attestationChain"
            name="attestationChain"
            value={selectedNetwork}
            onChange={handleNetworkChangeEvent}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            {Object.keys(networkContractAddresses).map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>
        <h3>Type in your Wallet Address / ENS</h3>
        <input
          type="text"
          placeholder="Type Address here"
          name="Attester"
          value={attestationData.Attester}
          onChange={handleAttestationChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="p-3">
        <h3>Please input a message!</h3>
        <input
          type="text"
          placeholder="Type here"
          name="Message"
          value={attestationData.Message}
          onChange={handleAttestationChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className="p-3">
        <h3>Please input the attestation you are referencing!</h3>
        <input
          type="text"
          placeholder="Type UID here"
          name="refUID"
          value={attestationData.refUID}
          onChange={handleAttestationChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <div className="ml-3 text-sm leading-6">
        <input
          type="checkbox"
          className="checkbox"
          id="ButtonClicked"
          name="ButtonClicked"
          checked={attestationData.ButtonClicked}
          onChange={handleAttestationChange}
        />
        <label htmlFor="comments" className=" px-3 font-medium text-gray-900">
          Tick to get your attestation
        </label>
      </div>
      <h2 className="flex justify-center items-center py-2">
        Get your Attestation
      </h2>

      {/* <div className='flex justify-center items-center py-2'>
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
        </div> */}
      <div className="flex justify-center items-center py-2">
        <button className="btn items-center" onClick={createAttestation}>
          Get your Attestation
        </button>
      </div>

      <h2 className="flex justify-center items-center py-2">
        Sign delegated attestation
      </h2>
      <div className="flex justify-center items-center py-2">
        <button className="btn items-center" onClick={delegateAtetstation}>
          Delegate Attestation
        </button>
      </div>

      <h2 className="flex justify-center items-center py-2">
        Revoke Attestation
      </h2>
      <div className="flex justify-center items-center py-2">
        <button
          className={`btn items-center`}
          //onClick={revokeAttestation}
        >
          Revoke Attestation
        </button>
      </div>
    </div>
  );
}
