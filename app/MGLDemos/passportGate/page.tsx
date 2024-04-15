'use client'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'

const API_KEY = process.env.NEXT_PUBLIC_GC_PASSPORT_API_KEY
const SCORER_ID = process.env.NEXT_PUBLIC_GC_PASSPORT_SCORER_ID

// endpoint for submitting passport
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport'
// endpoint for getting the signing message
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message'
// score needed to see hidden message
const THRESHOLD_NUMBER = 5

const headers = API_KEY ? ({
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
}) : undefined

declare global {
  interface Window{
    ethereum?: any
  }
}

export default function Passport() {
  // here we deal with any local state we need to manage
  const [address, setAddress] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const [score, setScore] = useState<string>('')
  const [noScoreMessage, setNoScoreMessage] = useState<string>('')

  async function checkConnection() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      // if the user is connected, set their account and fetch their score
      if (accounts && accounts[0]) {
        setConnected(true)
        setAddress(accounts[0].address)
        checkPassport(accounts[0].address)
      }
    } catch (err) {
      console.log('not connected...')
    }
  }

  useEffect(() => {
    checkConnection()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    
  async function getSigningMessage() {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, {
        headers
      })
      const json = await response.json()
      return json
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function submitPassport() {
    setNoScoreMessage('')
    try {
      // call the API to get the signing message and the nonce
      const { message, nonce } = await getSigningMessage()
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      // ask the user to sign the message
      const signature = await signer.signMessage(message)

      // call the API, sending the signing message, the signature, and the nonce
      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORER_ID,
          signature,
          nonce
        })
      })

      const data = await response.json()
      console.log('data:', data)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function connect() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])
      setConnected(true)
      checkPassport(accounts[0])
    } catch (err) {
      console.log('error connecting...')
    }
  }
    
  async function checkPassport(currentAddress = address) {
    setScore('')
    setNoScoreMessage('')
    // 
    const GET_PASSPORT_SCORE_URI = `https://api.scorer.gitcoin.co/registry/score/${SCORER_ID}/${currentAddress}`
    try {
      const response = await fetch(GET_PASSPORT_SCORE_URI, {
        headers
      })
      const passportData = await response.json()
      if (passportData.score) {
        // if the user has a score, round it and set it in the local state
        const roundedScore = Math.round(passportData.score * 100) / 100
        setScore(roundedScore.toString())
      } else {
        // if the user has no score, display a message letting them know to submit thier passporta
        console.log('No score available, please add stamps to your passport and then resubmit.')
        setNoScoreMessage('No score available, please submit your passport after you have added some stamps.')
      }
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
    <div data-theme="light">
      <div className="min-h-screen items-center justify-between p-24 bg-slate-50">
        <h1 className="text-black">Tech Demos</h1>
        <h2 className='text-black'>Integrating Gitcoin Passport for Sybil Protection </h2>
        {
          !connected &&
            <>
            <p>Please connect your wallet to continue.</p>

            <button className="btn" onClick={connect}>Connect Wallet</button>
            </>
        }
        {connected && !score &&
          <div>
            <p>Your wallet is connected. Please submit your passport to check your score.</p>
            <button className="btn" onClick={submitPassport}>Submit Passport</button>
            <button className="btn" onClick={() => checkPassport()}>Check Passport Score</button>
          </div>
        }
        {score && (
          <div>
            <h1>Your passport score is {score}</h1>
            <p>Please continue making attestations</p>
            <Link href="/MGLDemos">
                <button className='btn'>Demos</button>
            </Link>
          </div>
        )}
        {noScoreMessage && <p>{noScoreMessage}</p>}
      </div>
    </div>
  );
 }
  
