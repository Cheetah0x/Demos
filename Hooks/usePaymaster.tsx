//not ready to implement yet

// import { 
//     UserOperationRequest,
//     LocalAccountSigner,
//     createSmartAccountClient,
//     deepHexlify,
//     resolveProperties,
// } from '@alchemy/aa-core';
// import { 
//     http, 
//     createClient, 
//     Address 
// } from 'viem'; 
// import { optimismSepolia } from 'viem/chains'; 

// import { createMultiOwnerModularAccount } from '@alchemy/aa-accounts'
// import { generatePrivateKey } from 'viem/accounts'


// const PAYMASTER_RPC_URL = 'https://paymaster.optimism.io/v1/11155420/rpc'; 


// const superchainPaymasterClient = createClient({
//   chain: optimismSepolia,
//   transport: http(PAYMASTER_RPC_URL),
// }).extend((client) => ({
//   sponsorUserOperation: async (
//     request : UserOperationRequest,
//     entryPoint: Address,
//     ) =>
//     client.request({
//       method: 'pm_sponsorUserOperation',
//       params: [request, entryPoint],
//     }),
// }));


// const createSmartAccount = async () => {
//     const RPC_URL = 'https://sepolia.optimism.io/'

//     const smartAccountSigner =
//     LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey())

//     const modularAccount = await createMultiOwnerModularAccount({
//     signer: smartAccountSigner,
//     chain: optimismSepolia,
//     transport: http(RPC_URL),
//     })
// }

// const createSmartAccountClient = async () => {
//     const BUNDLER_RPC_URL = 'https://opt-sepolia.g.alchemy.com/v2/get-one-from-dashboard';

//     const modularAccount = await createSmartAccount(); // Declare the modularAccount variable

//     const smartAccountClient = createSmartAccountClient({
//         transport: http(BUNDLER_RPC_URL),
//         chain: optimismSepolia,
//         account: modularAccount,
//         gasEstimator: async (struct: any) => struct, // Add type annotation for struct
//         feeEstimator: async (struct: any) => struct, // Add type annotation for struct
//         paymasterAndData: {
//             paymasterAndData: async (struct: any, { account }: { account: any }) => { // Add type annotations for struct and account
//                 const sponsorOperationResult =
//                     await superchainPaymasterClient.sponsorUserOperation(
//                         deepHexlify(await resolveProperties(struct)) as UserOperationRequest,
//                         account.getEntryPoint().address,
//                     );
//                 return {
//                     ...struct,
//                     sponsorOperationResult, // Wrap sponsorOperationResult in an object
//                 };
//             },
//             dummyPaymasterAndData: () => '0x',
//         },
//     });
// };
