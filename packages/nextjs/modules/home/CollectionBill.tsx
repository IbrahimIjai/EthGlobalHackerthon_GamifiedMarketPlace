import React from "react";
import Image from "next/image";

export default function CollectionBill({ image }: { image: string }) {
  return (
    <div className="relative w-full border h-[300px] lg:h-[380px] lg:mx-8">
      <Image src={image} fill alt="Banner Image" />
    </div>
  );
}
