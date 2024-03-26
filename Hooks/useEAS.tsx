
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { EAS_ADDRESS, SCHEMA_REGISTRY_ADDRESS } from "../config/config";

export const useEAS = () => {
    const [eas, setEAS] = useState<EAS>();
    const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry>();
    const [currentAddress, setCurrentAddress] = useState("");
    useEffect(() => {
        const init = async () => {
            try {
                //Check if the sdk is already initialized
                if (currentAddress) return;

                console.log("Initializing EAS");

                //Initialize the sdk with the address of the EAS Schema contract address
                const easInstance = new EAS(EAS_ADDRESS);
                //const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
                console.log("Instances created: ", easInstance, "SchemaRegistry: ", SCHEMA_REGISTRY_ADDRESS);

                //Gets a default provider (in production use something else like infura/alchemy)
                const provider = new ethers.BrowserProvider(window.ethereum);
                console.log("Provider: ", provider);

                const signer = await provider.getSigner();
                console.log("Signer obtained: ", signer);

                const address = await signer.getAddress();
                console.log("Address obtained: ", address);

                //Connects an ethers style provider/signingProvider to perform read/write functions.
                easInstance.connect(signer); //allow Attesters to attest the button clicked schema
                //schemaRegistry.connect(signer); //allow owner to register (Not sure about this one just following orders)
                console.log("Connected to EAS");

                setEAS(easInstance);
                setSchemaRegistry(schemaRegistry);
                setCurrentAddress(address);
            } catch (error) {
                console.error("Error initializing EAS", error);
            }
        };
        init();

        //setCurrentAddress(provider);
    }, [eas, schemaRegistry, currentAddress]);

    return { eas, schemaRegistry, currentAddress };
};