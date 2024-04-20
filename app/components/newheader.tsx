import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from 'react';
import Link from 'next/link';

export default function NewHeader() {
    return(
        <div className="navbar bg-base-100">
        <div className="navbar-start">
            <Link href="/" className="btn btn-ghost text-xl">Metrics Garden Labs</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
            <li><a>Demos</a></li>
            <li><Link href="/login/">Login</Link></li>
            <li>
                <details>
                <summary>Simple Demos</summary>
                <ul className="p-2">
                    <li><Link href="/MGLDemos/Attest">Simple Attestation Demo</Link></li>
                    <li><Link href="/MGLDemos/Resolver">Resolver Contract Demo</Link></li>
                    <li><Link href="/MGLDemos/passportGate">Gitcoin Passport Gate</Link></li>

                </ul>
                </details>
            </li>
            </ul>
            <ul className="menu menu-horizontal px-1">
            <li>
                <details>
                <summary>Fetching Attestation Data</summary>
                <ul className="p-2">
                    <li><Link href="/MGLDemos/Fetch">Fetch Attestations by UID</Link></li>
                    <li><Link href="/MGLDemos/ByAttester">Fetch Attestations by Address</Link></li>
                    <li><Link href="/MGLDemos/AttestationChain">Return Attestation Chain</Link></li>
                    <li><Link href="/MGLDemos/coinbaseVerified">Check Coinbase Verified</Link></li>

                </ul>
                </details>
            </li>
            <li>
                <details>
                <summary>Webbed Attestations</summary>
                <ul className="p-2">
                    <li><Link href="/MGLDemos/WebbedAttestations"> Demo for Webbed Attestations</Link></li>
                    <li><Link href="/MGLDemos/WebbedAttestationSchema">Webbed Attestations, create Schemas</Link></li>
                    <li><Link href="/MGLDemos/ChainedAttestations">Chained Attestations</Link></li>
                    {/* <li><Link href="/MGLDemos/ChainedWithPayMaster">Chained With OP Paymaster</Link></li> */}

                </ul>
                </details>
            </li>
            </ul>
        </div>
        <div className="navbar-end">
            <ConnectButton />
        </div>
        </div>
    )
}