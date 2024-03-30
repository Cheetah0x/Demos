import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Header from './components/header'

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
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
