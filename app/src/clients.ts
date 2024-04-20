import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynarKey = process.env.NEYNAR_API_KEY;
const client = new NeynarAPIClient(neynarKey);
export default client;
