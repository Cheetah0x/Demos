import { NextResponse } from "next/server";
import { fetchAttestationChain } from "app/utils/attesationChainUtils";

export async function POST(request: Request) {
  try {
    const { uid, endpoint } = await request.json();
    const attestations = await fetchAttestationChain(uid, endpoint);
    return NextResponse.json({ attestations });
  } catch (error) {
    console.log("Error in API route: ", error);
    return NextResponse.json(
      { error: "An error occured while fetching the attestation chain" },
      { status: 500 }
    );
  }
}
