import Image from "next/image";
// import React from "react";
// import Image from "next/image";
import { AlertOctagon, RefreshCcw, Share2 } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { cn } from "~~/lib/utils";
import { Address } from "~~/components/scaffold-eth";
// import { FaEthereum } from "react-icons/fa";
import { Button, buttonVariants } from "~~/components/ui/Buttons";
import { BuyButton } from "~~/modules/collections/nftid/Buybutton";

// const NFTIdPage: NextPage = () => {
//   return (
//     <div className="grid-cols-3 gap-6 mx-1 mt-12 lg:mx-4 lg:grid">
//       <div className="col-span-1">
//         <div className="relative my-4 w-full h-[330px]">
//           <Image
//             src="https://martianmosaic.vercel.app/assets/collectionsbanner/boredape.webp"
//             fill
//             className="object-cover"
//             alt="Collection slide show"
//           />
//         </div>
//         <div className="hidden w-full lg:inline-flex">
//           <Traits />
//         </div>
//       </div>

//       <div className="flex flex-col col-span-2">
//         <Head />
//       </div>

//       <div className="lg:hidden">
//         <Traits />
//       </div>
//     </div>
//   );
// };

// export default NFTIdPage;

const Head = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4">
        <span className="text-lg font-bold text-gray-300">NFTNAME #23</span>
        <div>
          <span>#23</span>
          <span>NFT URL</span>
        </div>
      </div>
      <BuyButton collectionaddress="1" nftId="1" listingPrice="50" />
    </div>
  );
};

const Traits = () => {
  return (
    <div className="w-full px-6 mt-4 lg:px-2">
      <div className="flex items-center justify-between mb-2 font-bold text-gray-300 bg-gray-400/30">
        <span>Trait</span>
        <span>Quanty</span>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span>Body</span>
          <span>3%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Head</span>
          <span>2%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Background</span>
          <span>4%</span>
        </div>
      </div>
    </div>
  );
};

export default function NFTIdPage() {
  const { address } = useAccount();
  return (
    <div className="w-full px-6 mt-4 lg:px-16">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-5 ">
        <div className="lg:col-span-2">
          <div className="col-span-1 my-3 lg:hidden">
            <h1 className="text-2xl font-bold">DOKYO #293</h1>
          </div>
          <div className="relative mx-auto rounded-lg  border border-accent overflow-hidden w-full  h-[357px] lg:h-[421px] ">
            <Image src="/assets/testdokyo.jpeg" alt="An NFT Image" fill className="object-cover" />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col items-center flex-1 mx-auto">
            <div className="flex justify-end w-full lg:items-center lg:justify-between">
              <div className="hidden lg:inline-flex">
                <h1 className="text-3xl font-bold">DOKYO #293</h1>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">
                  <RefreshCcw className="w-4 h-4" />
                </Button>
                <Button variant="secondary">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="secondary">
                  <AlertOctagon className="w-4 h-4" /> Report
                </Button>
              </div>
            </div>

            <div className="flex justify-start w-full my-5">
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-bold">Owned by: </span>
                </p>{" "}
                <Address address={address} />
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <BuyButton collectionaddress="1" nftId="1" listingPrice="50" />
            </div>

            <div className="flex justify-start">
              <h1>Collection Info</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
