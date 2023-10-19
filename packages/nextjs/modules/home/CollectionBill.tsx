import React from "react";
import Image from "next/image";
import {

  ArrowRightIcon,

} from "@heroicons/react/24/outline";
import Link from "next/link";
export default function CollectionBill({
  image,
  collectionName,
  description,
  contractAddress,
}: {
  image: string;
  collectionName: string;
  description: string;
  contractAddress: string;
}) {
  const words = description.split(" ");
  const remainingWords = words.slice(0, 12).join(" ");
  return (
    <div className="relative w-full lg:w-[96%] rounded-xl overflow-hidden h-[300px] lg:h-[380px] lg:mx-8">
      <Image src={image} alt="NFT Image" fill className="object-cover min-w-full cursor-pointer" />
      <Link href={`/collection/${contractAddress}`}
        className="absolute backdrop-blur-[2px]  rounded-[.8rem] 
      bottom-8 h-24 opagbg hover:bg-secondary cursor-pointer w-full gap-4 px-4 group
      lg:w-[500px] left-1/2 transform -translate-x-1/2 easytransition flex items-center"
      >
        <div className="relative w-1/5 h-[85%] m-2 overflow-hidden rounded-xl bg-background ">
          <Image
            src={image}
            alt="NFT Image"
            fill
            className="object-cover min-w-full transition-all ease-in-out cursor-pointer hover:scale-105"
          />
        </div>
        <div className="w-3/5 gap-0">
          <p className="text-[.8rem] font-bold text-gray-300 ">Featured Collections</p>
          <h1 className="text-[1.1rem] font-bold">{collectionName}</h1>
          <p className="text-[.75rem]">{remainingWords}</p>
        </div>
        <div className="flex items-center justify-center p-4 rounded-full easytransition 1/5 bg-secondary group-hover:bg-primary">
          <ArrowRightIcon className="w-6 h-8" />
        </div>
      </Link>
    </div>
  );
}
