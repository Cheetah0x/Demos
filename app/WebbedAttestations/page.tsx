'use client';

import React, { useState, FormEvent} from 'react'
import ReCAPTCHA from 'react-google-recaptcha';
import { AttestationNetworkType, networkContractAddresses } from 'app/components/networkContractAddresses';
import { useEAS } from '../../Hooks/useEAS';


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


export default function WebbedAttestions() {

    //State changes for the form
    const [ captcha, setCaptcha ] = useState<string | null>("");
    const [ selectedNetwork, setSelectedNetwork ] = useState<AttestationNetworkType>('Sepolia');
    const [ projectName, setProjectName ] = useState<string>("");
    const [ websiteUrl, setWebsiteUrl ] = useState<string>("");
    const [ twitterUrl, setTwitterUrl ] = useState<string>("");
    const [ githubURL, setGithubURL ] = useState<string>("");

    //Recaptcha logic for the whlole form
    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log('Captcha value:', captcha);
        if (captcha){
            console.log('Captcha is valid');
        }
    }

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as AttestationNetworkType;
        setSelectedNetwork(value);
        console.log('Selected Network', value);
      };

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProjectName(value);
        console.log("Project Name", projectName);
    }

    const handleWebsiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setWebsiteUrl(value);
        console.log("Website Url", websiteUrl);
    }

    const handleTwitterUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTwitterUrl(value);
        console.log("Twitter Url", twitterUrl);
    }

    const handleGithubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setGithubURL(value);
        console.log("Github Url", githubURL);
    }


  return (
    <div data-theme='light' className='min-h-screen w-full flex justify-center items-center ' >
    
        <form onSubmit={onSubmit}>
            <h1 className='text-black'>EAS</h1>

            <div className="sm:col-span-4 p-3">
                                    <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">Select Attestation Network</label>
                                    <div className="mt-2">
                                        <select 
                                            id="attestationChain" 
                                            name="attestationChain"
                                            value={selectedNetwork}
                                            onChange={handleNetworkChange}  
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                            {Object.keys(networkContractAddresses).map((network) => (
                                                <option key={network} value={network}>
                                                {network}
                                            </option>
                                            ))}
                                        </select>
                                        </div>
            </div>

            <div className='p-3'>
                <h3>What is the name of your project?</h3>
                <input
                    type="projectName"
                    placeholder="Type Project Name here"
                    name="projectName"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <div className='p-3'>
                <h3>What is the website URL of your project?</h3>
                <input
                    type="websiteUrl"
                    placeholder="Type the website URL here"
                    name="websiteUrl"
                    value={websiteUrl}
                    onChange={handleWebsiteUrlChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <div className='p-3'>
                <h3>Please Input your Twitter URL</h3>
                <input
                    type="twitterUrl"
                    placeholder="Type your Twitter URL here"
                    name='twitterUrl'
                    value={twitterUrl}
                    //probably a good idea to change to attestationData.twitterUrl
                    onChange={handleTwitterUrlChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <div className='p-3'>
                <h3>Please input the Gihub URL of your Project</h3>
                <input
                    type="githubUrl"
                    placeholder="Type your Github URL here"
                    name='githubUrl'
                    value={githubURL}
                    onChange={handleGithubUrlChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>


            <div className='flex justify-center items-center py-2'>
                <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
            </div>

            <h2 className='flex justify-center items-center py-2'>Get your Attestation</h2>

            <div className='flex justify-center items-center py-2'>
                {/* //TODO: Add the logic for the attestation 
                    //This will have to create the multiple attestations
                    // while looking like they are only creating one*/}
                <button
                    className='btn items-center'
                    // onClick={createAttestation}
                >Get your Attestation
                </button>
            </div>
        </form>
    </div>

  )
}
