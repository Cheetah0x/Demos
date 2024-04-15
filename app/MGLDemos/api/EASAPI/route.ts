//having issues with build
import { NextResponse } from "next/server";
import { getAttestationsByAttester } from "../../../utils/byAttesterUtils";

export async function POST(request: Request) {
  try {
    const { attesterAddress, endpoint } = await request.json();
    const attestations = await getAttestationsByAttester(
      attesterAddress,
      endpoint
    );
    return NextResponse.json({ attestations });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching attestations" },
      { status: 500 }
    );
  }
}
