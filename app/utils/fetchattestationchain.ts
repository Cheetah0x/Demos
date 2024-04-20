import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const fetchAttestationChain = async (
  uid: string,
  endpoint: string
): Promise<{ attester: string; value: string }[]> => {
  try {
    //for only getting the important schema data
    const chain: { attester: string; value: string }[] = [];
    let currentUID = uid;
    while (currentUID) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
                            schema {schema}
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
        throw new Error(
          `API request failed: ${response.status} - ${errorText}`
        );
      }
      const responseData = await response.json();
      const attestations = responseData.data.attestations;

      if (!attestations || attestations.length === 0) {
        break; //no more attestations to fetch
      }

      const attestation = attestations[0];
      const schema = attestation.schema.schema;
      const schemaDecoder = new SchemaEncoder(schema);
      const decodedData = schemaDecoder.decodeData(attestation.data);

      console.log("Decoded Data", decodedData);

      //another attempt, this one is pretty in depth at seeing what type of data value is

      let value = "";

      if (Array.isArray(decodedData) && decodedData.length > 0) {
        const firstItem = decodedData[0];
        if (typeof firstItem === "object" && firstItem !== null) {
          if (firstItem.hasOwnProperty("value")) {
            value = String(firstItem.value);
          } else {
            value = JSON.stringify(firstItem);
          }
        } else {
          value = String(firstItem);
        }
      } else if (typeof decodedData === "object" && decodedData !== null) {
        value = JSON.stringify(decodedData);
      } else {
        value = String(decodedData);
      }

      console.log("Value", value);

      chain.push({ attester: attestation.attester, value });

      //TODO: Only display and return the decoded data.  Display as though it is one attestation and not a chain

      //attestation.decodedData = decodedData;
      // const value = String(decodedData[0]?.value?.value);

      // console.log("Value", value);

      //TODO: value should be a string, showing as a number
      // if (value) {
      //   chain.push({ attester: attestation.attester, value });
      // }

      // const projectNameProperty = decodedData.find(
      //   (prop) => prop.name === "projectName"
      // );

      //try to only get the important data
      // if (projectNameProperty) {
      //   console.log("Attestation data fetched successfully:", {
      //     attester: attestation.attester,
      //     projectName: projectNameProperty.value.value,
      //   });
      //   chain.push({
      //     attester: attestation.attester,
      //     projectName: projectNameProperty.value.value,
      //   });
      // }

      // chain.push({
      //   attester: attestation.attester,
      //   decodedData: decodedData,
      // });

      //prepare fof next iteration
      currentUID = attestation.refUID;
    }

    //need to check if the attestation has a refUID
    //if it does, use that refUID as the new UID to get the next attestation
    //repeat until refUID is null

    console.log("Attestation data fetched successfully:", chain);

    return chain;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
