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
            <li>
                <details>
                <summary>Simple Demos</summary>
                <ul className="p-2">
                    <li><Link href="/Attest">Simple Attestation Demo</Link></li>
                    <li><Link href="/Resolver">Resolver Contract Demo</Link></li>
                </ul>
                </details>
            </li>
            </ul>
            <ul className="menu menu-horizontal px-1">
            <li>
                <details>
                <summary>Fetching Attestation Data</summary>
                <ul className="p-2">
                    <li><Link href="/Fetch">Fetch Attestations by UID</Link></li>
                    <li><Link href="/ByAttester">Fetch Attestations by Address</Link></li>
                    <li><Link href="/AttestationChain">Return Attestation Chain</Link></li>
                </ul>
                </details>
            </li>
            <li>
                <details>
                <summary>Webbed Attestations</summary>
                <ul className="p-2">
                    <li><Link href="/WebbedAttestations"> Demo for Webbed Attestations</Link></li>
                    <li><Link href="/WebbedAttestationSchema">Webbed Attestations, create Schemas</Link></li>
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