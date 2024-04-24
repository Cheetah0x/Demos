import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '../providers';
import Header from '../components/header'
import NewHeader from '../components/newheader'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
 
import { ourFileRouter } from "../api/uploadthing/core";

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
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <NewHeader />
            {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
