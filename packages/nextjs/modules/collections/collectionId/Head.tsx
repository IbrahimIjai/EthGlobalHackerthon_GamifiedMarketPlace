import React from "react";
import Image from "next/image";
import MobileHead from "./MobileHeader";
import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/Buttons";

export default function CollectionHead() {
  return (
    <div>
      <div className="lg:hidden">
        <MobileHead />
      </div>
      <div className="opagbg rounded-md p-6">
        <div className="gap-4">
          <div className="relative my-4 w-24 h-24 ">
            <Image
              src="https://martianmosaic.vercel.app/assets/collectionsbanner/boredape.webp"
              fill
              className="object-cover"
              alt="Collection slide show"
            />
          </div>
          <div className="flex items-center">
            <Address address="0xbFEaDb211974Ce290A0d8bc51b6FB230bde6bf5A" hasBlockie={false} />
            <Button variant="outline">ERC721</Button>
          </div>
        </div>
        <div className="flex gap-2 items-center mt-4">
          <div className="flex items-center gap-2">
            <p>Floor Price</p>
            <Button variant="outline">ERC721</Button>
          </div>
          <div className="flex items-center gap-2">
            <p>1d Volume</p>
            <Button variant="outline">ERC721</Button>
          </div>
          <div className="flex items-center gap-2">
            <p>Royalty</p>
            <Button variant="outline">3%</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
