import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

//going to use my address as the contract address, im not sure about this
const schemaRegistryContractAddress = "need to see what this is meant to be";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);

const schema = "uint256 eventId, address Attester, bool Button Clicked";
const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; //Sepolia
const revocable = true;

const transaction = await schemaRegistry.register({
    schema,
    resolverAddress,
    revocable,
});

//wait for transaction to be validated
await transaction.wait();


