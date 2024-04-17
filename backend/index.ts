import { JsonRpcProvider, ethers } from "ethers";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import {
  SchemaEncoder,
  EAS,
  Delegated,
  EIP712AttestationParams,
  DelegatedProxy,
} from "@ethereum-attestation-service/eas-sdk";

dotenv.config();

const app = express();
const port = 3005;

//Middleware to parse JSON
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

app.post("/signDelegatedAttestation", async (req, res) => {
  try {
    const {
      signature,
      recipient,
      schema,
      refUID,
      data,
      deadline,
      value,
      expirationTime,
      attester,
      nonce,
    } = req.body;

    console.log("Signature", signature);
    console.log("Attester Address", recipient);
    console.log("Schema UID", schema);
    console.log("Ref UID", refUID);
    console.log("Encoded Data", data);

    const privateKey = process.env.BACKEND_METAMASK_PRIVATE_KEY as string;
    // const provider = new JsonRpcProvider("https://rpc.sepolia.org");

    //for OP
    //const provider = new JsonRpcProvider("https://optimism-mainnet.infura.io");
    const provider = ethers.getDefaultProvider("optimism");
    const backendWallet = new ethers.Wallet(privateKey, provider);

    //dont think i need this with the eas instance
    const contract = new ethers.Contract(
      "0x4200000000000000000000000000000000000021",
      [
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "schema",
                  type: "bytes32",
                },
                {
                  components: [
                    {
                      internalType: "address",
                      name: "recipient",
                      type: "address",
                    },
                    {
                      internalType: "uint64",
                      name: "expirationTime",
                      type: "uint64",
                    },
                    {
                      internalType: "bool",
                      name: "revocable",
                      type: "bool",
                    },
                    {
                      internalType: "bytes32",
                      name: "refUID",
                      type: "bytes32",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      internalType: "uint256",
                      name: "value",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct AttestationRequestData",
                  name: "data",
                  type: "tuple",
                },
                {
                  components: [
                    {
                      internalType: "uint8",
                      name: "v",
                      type: "uint8",
                    },
                    {
                      internalType: "bytes32",
                      name: "r",
                      type: "bytes32",
                    },
                    {
                      internalType: "bytes32",
                      name: "s",
                      type: "bytes32",
                    },
                  ],
                  internalType: "struct EIP712Signature",
                  name: "signature",
                  type: "tuple",
                },
                {
                  internalType: "address",
                  name: "attester",
                  type: "address",
                },
              ],
              internalType: "struct DelegatedAttestationRequest",
              name: "delegatedRequest",
              type: "tuple",
            },
          ],
          name: "attestByDelegation",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
      ],
      backendWallet
    );

    const contractData = {
      schema: schema,
      data: {
        recipient: recipient,
        data: data,
        expirationTime: expirationTime,
        revocable: true,
        refUID: refUID,
        value: value,
      },
      signature: signature,
      attester: attester,
      deadline: deadline,
    };
    console.log(contractData);

    //const eas = new EAS("0xC2679fBD37d54388Ce493F1DB75320D236e1815e");
    //using op
    // const eas = new EAS("0x4200000000000000000000000000000000000021");

    // console.log("backend wallet ady", backendWallet.address);

    //eas.connect(backendWallet);
    //eas.contract.connect(backendWallet);

    //console.log("eas signer", eas.contract.connect(backendWallet));
    //const tx = await eas.attestByDelegation(contractData);

    const tx = await contract.attestByDelegation(contractData);
    const receipt = await tx.wait();
    console.log("Transaction receipt", receipt);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function attestByDelegation(arg0: {
  schema: any;
  data: {
    recipient: any;
    expirationTime: undefined;
    refUID: any;
    revocable: boolean; //Be aware
    data: any;
  };
  signature: any;
  attester: any;
  deadline: bigint;
}) {
  throw new Error("Function not implemented.");
}
