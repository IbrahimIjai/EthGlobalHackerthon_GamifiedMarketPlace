import React from "react";
import { useRouter } from "next/router";
import { isAddress } from "@ethersproject/address";
import { AiOutlineUser } from "react-icons/ai";
import { useAccount, useEnsAvatar } from "wagmi";
import { NFTCombobox } from "~~/components/NFTComboBox";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/Buttons";
import { buttonVariants } from "~~/components/ui/Buttons";
import { Label } from "~~/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "~~/components/ui/RadioGroup";

export default function ProfileHeader() {
  const router = useRouter();
  const pathname = router.asPath;
  const addressUrl = pathname.split("/profile/")[1];
  const { data: avatar } = useEnsAvatar({ name: addressUrl as string });

  return (
    <div className="flex flex-col w-full gap-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {addressUrl && <BlockieAvatar address={addressUrl} size={30} ensImage={avatar} />}
          <span className="text-lg font-bold">
            {addressUrl.slice(0, 5)}... {addressUrl.slice(35, 42)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <AiOutlineUser />
            Edit Profile
          </Button>
          <Button variant="outline">Cancel Listing</Button>
        </div>
      </div>
      <div className="mx-auto">
        <RadioGroup defaultValue="trending" className="flex font-bold border-accent">
          <div>
            <RadioGroupItem value="trending" id="trending" className="sr-only peer" />
            <Label
              htmlFor="trending"
              className={buttonVariants({
                variant: "outline",
                className: " peer-data-[state=checked]:bg-primary cursor-pointer",
              })}
            >
              🧑🏻‍🚀 NFTS
            </Label>
          </div>
          <div>
            <RadioGroupItem value="watchlist" id="watchlist" className="sr-only peer" />
            <Label
              htmlFor="watchlist"
              // className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
              className={buttonVariants({
                variant: "outline",
                className: " peer-data-[state=checked]:bg-primary cursor-pointer",
              })}
            >
              👓 Activites
            </Label>
          </div>
          <div>
            <RadioGroupItem value="highestvolume" id="highestvolume" className="sr-only peer" />
            <Label
              htmlFor="highestvolume"
              className={buttonVariants({
                variant: "outline",
                className: " peer-data-[state=checked]:bg-primary cursor-pointer",
              })}
            >
              🏋🏾‍♀️ Achievements
            </Label>
          </div>
        </RadioGroup>
      </div>
      {/* <NFTCombobox /> */}
    </div>
  );
}
