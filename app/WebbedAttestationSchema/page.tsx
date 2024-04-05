
//TODO: The logic of this page
//TODO: Create a form based on Lauras spec

//TODO:Create different attestations for every element of the form
//Different schemas for each element
//make them all reference eachother, this is going to be the difficult part
//maybe there is a bigger attestation that they all point to?
//add in the logic for swapping between chains
    //build logic to create attestations for each chain

//Multiple attestations for the form
//Attestation 1: Name of the project
//Attestation 2: Website of the project
//Attestation 3: Twitter URL
//Attestation 4: Github URL
//Attestation 5: Main Attestation that references all of the other ones

//this page here allows the user to create the schemas aswell as the attestations.
//could be useful for making schemas that do not exist yet. 

'use client';

import React, { useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AttestationNetworkType, networkContractAddresses } from 'app/components/networkContractAddresses';
import { useEAS } from '../../Hooks/useEAS';
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

type AttestationData = {
  projectName: string;
  websiteUrl: string;
  twitterUrl: string;
  githubURL: string;
};

export default function WebbedAttestations() {
  const [captcha, setCaptcha] = useState<string | null>('');
  const [attestationData, setAttestationData] = useState<AttestationData>({
    projectName: '',
    websiteUrl: '',
    twitterUrl: '',
    githubURL: '',
  });
  console.log('Attestation Data:', attestationData);

  const { eas, schemaRegistry, currentAddress, selectedNetwork, handleNetworkChange } = useEAS();
  console.log('EAS:', eas);
  console.log('SchemaRegistry:', schemaRegistry);
  console.log('Current Address:', currentAddress);
  console.log('Selected Network:', selectedNetwork);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Captcha value:', captcha);
    if (captcha) {
      console.log('Captcha is valid');
    }
  };

  const handleNetworkChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as AttestationNetworkType;
    handleNetworkChange(selectedValue);
    console.log('Selected Network', selectedValue);
  };

  const handleAttestationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttestationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createAttestation = async () => {
    if (!captcha) {
      alert('Please complete the captcha to continue');
      return;
    }

    if (!eas || !schemaRegistry || !currentAddress) {
      console.error('EAS, SchemaRegistry, or currentAddress not available');
      return;
    }

    try {
      // Create project name attestation
      const projectNameSchema = await schemaRegistry.register({
        schema: 'string projectName',
        resolverAddress: undefined,
        revocable: true,
      });
      const projectNameSchemaUid = await projectNameSchema.wait();
      console.log("Project Name Schema UID: ", projectNameSchemaUid);

      const projectNameAttestation = await eas.attest({
        schema: projectNameSchemaUid,
        data: {
          recipient: currentAddress,
          expirationTime: undefined,
          revocable: true,
          data: new SchemaEncoder('string projectName').encodeData([
            { name: 'projectName', value: attestationData.projectName, type: 'string' },
          ]),
        },
      });
      const projectNameAttestationUID = await projectNameAttestation.wait();
      console.log("Project Name Attestation UID: ", projectNameAttestationUID);

      // Create website URL attestation
      const websiteUrlSchema = await schemaRegistry.register({
        schema: 'string websiteUrl',
        resolverAddress: undefined,
        revocable: true,
      });
      const websiteUrlSchemaUid = await websiteUrlSchema.wait();
      console.log("Website Url Schema Uid: ", websiteUrlSchemaUid);

      const websiteUrlAttestation = await eas.attest({
        schema: websiteUrlSchemaUid,
        data: {
          recipient: currentAddress,
          expirationTime: undefined,
          revocable: true,
          data: new SchemaEncoder('string websiteUrl').encodeData([
            { name: 'websiteUrl', value: attestationData.websiteUrl, type: 'string' },
          ]),
        },
      });
      const websiteUrlAttestationUID = await websiteUrlAttestation.wait();
      console.log("Website Url Attestation UID: ", websiteUrlAttestationUID);

      // Create Twitter URL attestation
      const twitterUrlSchema = await schemaRegistry.register({
        schema: 'string twitterUrl',
        resolverAddress: undefined,
        revocable: true,
      });
      const twitterUrlSchemaUid = await twitterUrlSchema.wait();
      console.log("Twitter Url Schema Uid: ", twitterUrlSchemaUid);

      const twitterUrlAttestation = await eas.attest({
        schema: twitterUrlSchemaUid,
        data: {
          recipient: currentAddress,
          expirationTime: undefined,
          revocable: true,
          data: new SchemaEncoder('string twitterUrl').encodeData([
            { name: 'twitterUrl', value: attestationData.twitterUrl, type: 'string' },
          ]),
        },
      });
      const twitterUrlAttestationUID = await twitterUrlAttestation.wait();
      console.log("Twitter Url Attestation UID: ", twitterUrlAttestationUID);

      // Create GitHub URL attestation
      const githubUrlSchema = await schemaRegistry.register({
        schema: 'string githubUrl',
        resolverAddress: undefined,
        revocable: true,
      });
      const githubUrlSchemaUid = await githubUrlSchema.wait();
      console.log("Github Url Schema Uid: ", githubUrlSchemaUid);

      const githubUrlAttestation = await eas.attest({
        schema: githubUrlSchemaUid,
        data: {
          recipient: currentAddress,
          expirationTime: undefined,
          revocable: true,
          data: new SchemaEncoder('string githubUrl').encodeData([
            { name: 'githubUrl', value: attestationData.githubURL, type: 'string' },
          ]),
        },
      });
      const githubUrlAttestationUID = await githubUrlAttestation.wait();
      console.log("Github Url Attestation UID: ", githubUrlAttestationUID);

      // Create main attestation
      const mainSchema = await schemaRegistry.register({
        schema: 'string projectName, string websiteUrl, string twitterUrl, string githubURL, bytes32[] refUIDs',
        resolverAddress: undefined,
        revocable: true,
      });
      const mainSchemaUid = await mainSchema.wait();
      console.log("Main Schema UID: ", mainSchemaUid);

      const mainAttestation = await eas.attest({
        schema: mainSchemaUid,
        data: {
          recipient: currentAddress,
          expirationTime: undefined,
          revocable: true,
          data: new SchemaEncoder('string projectName, string websiteUrl, string twitterUrl, string githubURL, bytes32[] refUIDs').encodeData([
            { name: 'projectName', value: attestationData.projectName, type: 'string' },
            { name: 'websiteUrl', value: attestationData.websiteUrl, type: 'string' },
            { name: 'twitterUrl', value: attestationData.twitterUrl, type: 'string' },
            { name: 'githubURL', value: attestationData.githubURL, type: 'string' },
            { name: 'refUIDs', value: [projectNameAttestationUID, websiteUrlAttestationUID, twitterUrlAttestationUID, githubUrlAttestationUID], type: 'bytes32[]' },
          ]),
        },
      });
      const mainAttestationUID = await mainAttestation.wait();
      console.log('Main Attestation UID:', mainAttestationUID);

      console.log('Attestations created successfully');
      // Reset form fields or perform any other necessary actions
    } catch (error) {
      console.error('Failed to create attestations:', error);
      alert('An error occurred while creating attestations. Please try again.');
    }
  };

  return (
    <div data-theme="light" className="min-h-screen w-full flex justify-center items-center">
      <form onSubmit={onSubmit}>
        <h1 className="text-black">EAS</h1>
        <p>This page still has the logic to create schemas and then attest to them
            , if it fails the schema already exists on the selected network. 
        </p>

        <div className="sm:col-span-4 p-3">
          <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">
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
        </div>

        <div className="p-3">
          <h3>What is the name of your project?</h3>
          <input
            type="text"
            placeholder="Type Project Name here"
            name="projectName"
            value={attestationData.projectName}
            onChange={handleAttestationChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="p-3">
          <h3>What is the website URL of your project?</h3>
          <input
            type="text"
            placeholder="Type the website URL here"
            name="websiteUrl"
            value={attestationData.websiteUrl}
            onChange={handleAttestationChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="p-3">
          <h3>Please Input your Twitter URL</h3>
          <input
            type="text"
            placeholder="Type your Twitter URL here"
            name="twitterUrl"
            value={attestationData.twitterUrl}
            onChange={handleAttestationChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="p-3">
          <h3>Please input the Github URL of your Project</h3>
          <input
            type="text"
            placeholder="Type your Github URL here"
            name="githubURL"
            value={attestationData.githubURL}
            onChange={handleAttestationChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="flex justify-center items-center py-2">
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
        </div>

        <h2 className="flex justify-center items-center py-2">Get your Attestation</h2>

        <div className="flex justify-center items-center py-2">
          <button className="btn items-center" onClick={createAttestation}>
            Get your Attestation
          </button>
        </div>
      </form>
    </div>
  );
}