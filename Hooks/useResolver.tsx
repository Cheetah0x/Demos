
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { EAS_ADDRESS } from "../config/config";

export const useResolver = () => {
    const [resolver, setResolver] = useState<EAS>();
    const [currentAddress, setCurrentAddress] = useState("");
    useEffect(() => {
        const init1 = async () => {
            try {
                //check if the sdk is already initialized
                if (currentAddress) return;

                console.log("Initializing Resolver");

                //initialize the sdk with the address of the EAS Schema contract address
                const easResolverInstance = new EAS(EAS_ADDRESS);
                console.log("Instance created: ", easResolverInstance);

                const provider = new ethers.BrowserProvider(window.ethereum);
                console.log("Provider: ", provider);

                const signer = await provider.getSigner();
                console.log("Signer obtained: ", signer);

                const address = await signer.getAddress();
                console.log("Address obtained: ", address);

                //connects an ethers style provider/signingProvider to perform read/write functions
                easResolverInstance.connect(signer);//allow resolver to attest to the button clicked schema
                console.log("Connected to Resolver");

                setResolver(easResolverInstance);
                setCurrentAddress(address);
            } catch (error) {
                console.error("Error initializing Resolver", error);
            }
        };
        init1();

        //setCurrentAddress(provider);
    }, [resolver, currentAddress]);

    return { resolver, currentAddress };
};