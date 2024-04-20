import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '../providers';
import Header from '../components/header'
import NewHeader from '../components/newheader'
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetricsGardenDemo",
  description: "Demos for MetricsGardenLabs",
};



function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <Providers>
          <NewHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;


//added the farcaster authorisation in here