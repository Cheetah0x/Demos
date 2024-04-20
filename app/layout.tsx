import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Header from './components/header'
import NewHeader from './components/newheader'
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';


//lets do sign in with neynar instead, hopefully thats easier

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetricsGardenDemo",
  description: "Demos for MetricsGardenLabs",
};

//change with production version when live,
//i wonder if the rpc it like alchemy or infura
// const config = {
//   rpcUrl: 'https://mainnet.optimism.io',
//   domain: 'localhost:3000',
//   siweUri: 'http://localhost:3000/',
// };

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <AuthKitProvider config={config} > */}
        <Providers>
          {children}
        </Providers>
        {/* </AuthKitProvider> */}
      </body>s
    </html>
  );
}

export default RootLayout;
