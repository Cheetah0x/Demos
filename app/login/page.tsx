
'use client';
import React, { useEffect, useContext, useState } from 'react';

import NewHeader from '../components/newheader';
import '@farcaster/auth-kit/styles.css';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import useLocalStorage from 'Hooks/use-local-storage-state';
import { useGlobalState } from 'config/config';


//dont think i need the api key for this


declare global {
  interface Window {
    onSignInSuccess?: (data: SignInSuccessData) => void | undefined;
  }
}

interface SignInSuccessData {
  signer_uuid: string;
  fid: string;
}

export default function Login() {

  const [user, setUser] = useLocalStorage("user");
  const [ signerUuid, setSignerUuid] = useGlobalState('signerUuid');
  const [ fid, setFid ] = useGlobalState('fid');
  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;



  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    // Identify or create the script element
    const scriptId = "neynar-signin-script";
    let script = document.getElementById(scriptId)as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      // Set attributes and source of the script
      script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
      script.async = true;
      script.defer = true;

      document.body.appendChild(script);
    }
    window.onSignInSuccess = (data) => {
      setUser({
        signerUuid: data.signer_uuid,
        fid: data.fid,
      });
      setSignerUuid(data.signer_uuid);
      //signer uuid is private and part of the app
      setFid(data.fid);
    };

    return () => {
      window.onSignInSuccess = undefined;
      document.getElementById(scriptId)?.remove();
    }
  },[setUser, setSignerUuid, setFid])
  console.log("user", user)
  return (
    <>
      <NewHeader />
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='card w-full  md:w-1/2 sm:w-3/4 bg-base-100 shadow-xl'>
          <div className='card-body justify-center items-center'>
          <h2 className="text-center font-semibold text-lg mb-4">Sign-in</h2>
          <p className="text-center mb-6">Please sign in with your Farcaster account</p>
            <div
              className="neynar_signin mt-6"
              data-client_id={client_id}
              data-success-callback="onSignInSuccess"
              data-theme='light'
              data-variant='farcaster'
              data-logo_size='30px'
              data-height='48px'
              data-width='218px'
              data-border_radius='10px'
              data-font_size='16px'
              data-font_weight='300'
              data-padding='8px 15px'
              data-margin='0'
            />
          </div>
        
          
        <p>FID: {fid}</p>
      </div>
      </div>
    </>
    
  );
}


