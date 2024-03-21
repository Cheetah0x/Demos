export const MY_ADDY = process.env.MY_ADDY;
export const ATTESTER_ADDY = process.env.ATTESTER_ADDY;

export const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";//Sepolia v0.26
export const SCHEMA_REGISTRY_ADDRESS = " 0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; //sepolia

export const SCHEMA = "address Attester,string Message, bool ButtonClicked";
export const SCHEMA_DETAILS = {
    schemaName: "Did they press the button?",
    Attester: "Attesters Address",
    Message: "The Message to Attest to",
    ButtonClicked: "bool (Yes or No)"
};