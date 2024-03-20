import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-end p-12">
        <ConnectButton />
      </div>
      {/* going to create a link to a new page that simply has a box in it,  click on the box then you can attest to it */}

      <Link href="/EAS" className="text-white">EAS</Link>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-50">
        <h1 className="text-black">RainbowKit Demo</h1>
      </main>

    </>
  );
}
