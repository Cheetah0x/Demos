import React from 'react'

//In this file, i am going to try to make attestations on other peoples behalf

//TODO: Make the resolver contract

export default function ResolverDemo() {
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
                    //value={attestationData.Attester}
                    //onChange={handleAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
                <p>This contract is the owner of this schema ...</p>
            </div>

            <div className='p-3'>
                <h3>Type in you wallet address / ENS</h3>
                <input
                    type="text"
                    placeholder="Type Address here"
                    name="SchemaOwner"
                    //value={attestationData.Attester}
                    //onChange={handleAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
                <p>The owner of the schema will make the attestation on behalf of this wallet</p>
            </div>


            <div className='p-3'>
                <h3>Please input a message!</h3>
                <input
                    type="text"
                    placeholder="Type here"
                    name='Message'
                    //value={attestationData.Message}
                    //onChange={handleAttestationChange}
                    className="input input-bordered w-full max-w-xs" />
            </div>

            <h2 className='flex justify-center items-center py-2'>Get your Attestation</h2>

            <div className='flex justify-center items-center py-2'>
                <button
                    className='btn items-center'
                //onClick={createAttestation}
                >Get your Attestation
                </button>
            </div>





        </div>
    )
}

