import React from "react";
import { useRouter } from "next/router";
import { isAddress } from "@ethersproject/address";
import { useAccount } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";

export default function ProfileHeader() {
  const ensAvatar = useAccount();
  const router = useRouter();
  const pathname = router.asPath;
  const addressUrl = pathname.split("/profile/")[1];
  console.log("this is address from url", address, address == addressUrl);

  return <div>{address && <BlockieAvatar address={address} size={30} ensImage={address.ensAvatar} />}</div>;
}
