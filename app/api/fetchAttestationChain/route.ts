

export const fetchAttestationChain = async (uid: string, endpoint: string): Promise<any[]> => {
    try {
        const chain: any[] = [];
        let currentUID = uid;
        while (currentUID) {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query Attestations($uid: String!) {
                        attestations(
                            where: { id: { equals: $uid } }
                            ) {
                            id
                            attester
                            recipient
                            refUID
                            revocable
                            data
                        }
                        }
                    `,
                    variables: {
                        uid: currentUID,
                    },
                }),
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }
      
            const responseData =  await response.json();
            const attestations = responseData.data.attestations;

            if (!attestations || attestations.length === 0) {
                break; //no more attestations to fetch
            }

            const attestation = attestations[0];
            chain.push(attestation);

            //prepare fof next iteration
            currentUID = attestation.refUID;
        }
  
      //need to check if the attestation has a refUID
      //if it does, use that refUID as the new UID to get the next attestation
      //repeat until refUID is null

      console.log('Attestation data fetched successfully:', chain);

      return chain;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };