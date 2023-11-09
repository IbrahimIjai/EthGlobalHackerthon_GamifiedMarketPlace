import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/Buttons";
import { FaEthereum } from "react-icons/fa";
import { cn } from "~~/lib/utils";

export default function NFTCard() {
  return (
    <div className="relative flex flex-col overflow-hidden  rounded-2xl cursor-pointer  backdrop-blur-[4px] shadow-lg bg-muted dark:bg-muted/40">
      <div className="relative w-1/2  easyTransition overflow-hidden lg:w-full h-[187px] lg:h-[211px] ">
        <Image
          src="/assets/testdokyo.jpeg"
          alt="An NFT Image"
          fill
          className="object-cover easyTransition hover:scale-110"
        />
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex item-center">
          <FaEthereum size={15} />
          <p className="">
            <span className="font-bold">2</span> ETH
          </p>
        </div>
        <Button>Buy Now</Button>
      </div>
      <p className="absolute z-20 p-2 rounded right-2 top-2 bg-muted/40">#234</p>
    </div>
  );
}
{
  /* <Link
          href='/'
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20'
          )}></Link> */
}
