import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/Buttons";

export default function Listings() {
  const router = useRouter();
  const { collectionaddress } = router.query;
  // console.log("this is pid", collectionaddress);
  if (!collectionaddress)
    return (
      <div className="flex min-h-[60vh] justify-center items-center">
        <p className="title_h1">Undefined collection</p>
      </div>
    );
  return (
    <div className="mt-4 col-span-5">
      <p className="title_h1 mx-3 my-6">Listings</p>
      <div className="opagbg w-full">
        <div className="flex items-center w-full justify-between p-6">
          <span>3Listed</span>
          <span>Buy Now</span>
          <span>Owner</span>
          <span>Time</span>
        </div>
        <div>
          {[1, 2, 3, 4, 5, 6].map((item, i) => {
            return <Cards collectionaddress={collectionaddress} nftId={item} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
}

const Cards = ({
  collectionaddress,
  nftId,
}: {
  collectionaddress: string | string[] | undefined;
  nftId: string | number;
}) => {
  return (
    <Link
      href={`/collections/${collectionaddress}/${nftId}`}
      className="flex cursor-pointer items-center w-full justify-between p-6 hover:bg-muted easytransition"
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-md">
        <Image
          src="https://martianmosaic.vercel.app/assets/collectionsbanner/boredape.webp"
          fill
          className="object-cover"
          alt="NFT Image"
        />
      </div>
      <Button variant="outline" className=" flex P-1 gap-1 ">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.75432 0.819537C7.59742 0.726821 7.4025 0.726821 7.24559 0.819537L1.74559 4.06954C1.59336 4.15949 1.49996 4.32317 1.49996 4.5C1.49996 4.67683 1.59336 4.84051 1.74559 4.93046L7.24559 8.18046C7.4025 8.27318 7.59742 8.27318 7.75432 8.18046L13.2543 4.93046C13.4066 4.84051 13.5 4.67683 13.5 4.5C13.5 4.32317 13.4066 4.15949 13.2543 4.06954L7.75432 0.819537ZM7.49996 7.16923L2.9828 4.5L7.49996 1.83077L12.0171 4.5L7.49996 7.16923ZM1.5695 7.49564C1.70998 7.2579 2.01659 7.17906 2.25432 7.31954L7.49996 10.4192L12.7456 7.31954C12.9833 7.17906 13.2899 7.2579 13.4304 7.49564C13.5709 7.73337 13.4921 8.03998 13.2543 8.18046L7.75432 11.4305C7.59742 11.5232 7.4025 11.5232 7.24559 11.4305L1.74559 8.18046C1.50786 8.03998 1.42901 7.73337 1.5695 7.49564ZM1.56949 10.4956C1.70998 10.2579 2.01658 10.1791 2.25432 10.3195L7.49996 13.4192L12.7456 10.3195C12.9833 10.1791 13.2899 10.2579 13.4304 10.4956C13.5709 10.7334 13.4921 11.04 13.2543 11.1805L7.75432 14.4305C7.59742 14.5232 7.4025 14.5232 7.24559 14.4305L1.74559 11.1805C1.50785 11.04 1.42901 10.7334 1.56949 10.4956Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span>5ETH</span>
      </Button>
      <div>
        <Address address="0xbFEaDb211974Ce290A0d8bc51b6FB230bde6bf5A" />
      </div>
      <p>2H</p>
    </Link>
  );
};
