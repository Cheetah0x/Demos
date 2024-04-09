
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

//going to code the schemaUid in as i am having trouble making them on the fly
//SchemaUIDs
//projectName - 0x539397476db05adcf9dacc07a6d711729f80da37bd9b973028a92ca4a50cfa94
//websiteUrl - 0xf209dfc21472d0e774ddfa207a444edad4dec5f96a9a848620717010df0996a7
//twitterUrl - 0xf0db1cb08a321f016d9659fa53bbb4227b46962e20752b30ae45339fdda8510d
//githubUrl - 0xed904085b3b88a244dadef36963683fec869690f273cf1e18619b5346690c742
//mainSchema - 0x3608fb19fbaef55860432c4961d03ec250ceaa3f38db067953611cee5b128f80

'use client';

import React, { useState, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AttestationNetworkType, networkContractAddresses } from 'app/components/networkContractAddresses';
import { useEAS } from '../../../Hooks/useEAS';
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

    if (!eas || !currentAddress) {
      console.error('EAS or currentAddress not available');
      return;
    }

    try {
      // Create project name attestation
      const projectNameSchemaUid = '0x539397476db05adcf9dacc07a6d711729f80da37bd9b973028a92ca4a50cfa94';
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
      const websiteUrlSchemaUid = '0xf209dfc21472d0e774ddfa207a444edad4dec5f96a9a848620717010df0996a7';
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
      const twitterUrlSchemaUid = '0xf0db1cb08a321f016d9659fa53bbb4227b46962e20752b30ae45339fdda8510d';
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
      const githubUrlSchemaUid = '0xed904085b3b88a244dadef36963683fec869690f273cf1e18619b5346690c742';
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
      const mainSchemaUid = '0x3608fb19fbaef55860432c4961d03ec250ceaa3f38db067953611cee5b128f80';
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