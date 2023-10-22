import Image from "next/image";
import type { NextPage } from "next";
import { BuyButton } from "~~/modules/collections/nftid/Buybutton";

const NFTIdPage: NextPage = () => {
  return (
    <div className="mx-1 lg:mx-4 mt-12 lg:grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="relative my-4 w-full h-[330px]">
          <Image
            src="https://martianmosaic.vercel.app/assets/collectionsbanner/boredape.webp"
            fill
            className="object-cover"
            alt="Collection slide show"
          />
        </div>
        <div className="hidden w-full lg:inline-flex">
          <Traits />
        </div>
      </div>

      <div className="col-span-2 flex flex-col">
        <Head />
      </div>

      <div className="lg:hidden">
        <Traits />
      </div>
    </div>
  );
};

export default NFTIdPage;

const Head = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4">
        <span className="font-bold text-lg text-gray-300">NFTNAME #23</span>
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
    <div className="w-full px-6 lg:px-2 mt-4">
      <div className="text-gray-300 bg-gray-400/30 mb-2 flex justify-between items-center  font-bold">
        <span>Trait</span>
        <span>Quanty</span>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <span>Body</span>
          <span>3%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Head</span>
          <span>2%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Background</span>
          <span>4%</span>
        </div>
      </div>
    </div>
  );
};
