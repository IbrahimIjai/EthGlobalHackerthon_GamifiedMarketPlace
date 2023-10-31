import React from "react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~~/components/ui/Accordion";
import { Checkbox } from "~~/components/ui/Checkbox";
import { collections } from "~~/utils/collections";

export default function Filters() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="nftstatus" className="border-muted">
          <AccordionTrigger className="px-8 mb-3 font-bold border-none data-[state=open]:bg-secondary">
            NFT Status
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3 px-8">
              <div className="flex items-center justify-between w-full">
                <label htmlFor="listed" className=" peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Listed
                </label>
                <Checkbox id="listed" />
              </div>
              <div className="flex items-center justify-between w-full">
                <label htmlFor="unlisted" className=" peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Unlisted
                </label>
                <Checkbox id="unlisted" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="nftstatus" className="border-muted">
          <AccordionTrigger className="px-8 mb-3 font-bold border-none data-[state=open]:bg-secondary">
            Collections
          </AccordionTrigger>
          <AccordionContent>
            {collections.map((item, i) => {
              return (
                <div key={i} className="flex items-center justify-between px-8">
                  <CollectionCard collectionName={item.name} image_url={item.bannerImage} symbol={item.symbol} />
                  <Checkbox id={item.symbol} />
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const CollectionCard = ({
  image_url,
  collectionName,
  symbol,
}: {
  image_url: string;
  collectionName: string;
  symbol: string;
}) => {
  return (
    <label htmlFor={symbol} className="flex items-center gap-3">
      <div className="relative w-8 h-8">
        <Image src={image_url} alt="Collection Image" fill className="objectFit-cover" />
      </div>
      <p className="semibold">{collectionName}</p>
    </label>
  );
};
