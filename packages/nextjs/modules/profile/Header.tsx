import React from "react";
import { useRouter } from "next/router";
import { isAddress } from "@ethersproject/address";
import { useAccount, useEnsAvatar } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";

export default function ProfileHeader() {
  const router = useRouter();
  const pathname = router.asPath;
  const addressUrl = pathname.split("/profile/")[1];
  const { data: avatar } = useEnsAvatar({ name: addressUrl as string });

  return (
    <div>
      <div className="flex items-center gap-2">
        {addressUrl && <BlockieAvatar address={addressUrl} size={30} ensImage={avatar} />}
        <span className="text-lg font-bold">
          {addressUrl.slice(0, 5)}... {addressUrl.slice(35, 42)}
        </span>
      </div>
    </div>
  );
}
