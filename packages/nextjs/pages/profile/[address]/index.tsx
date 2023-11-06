import React from "react";
import Filters from "~~/modules/profile/Filters";
import ProfileHeader from "~~/modules/profile/Header";
import MobileFilters from "~~/modules/profile/MobileFilters";
import NFTLists from "~~/modules/profile/NFTLists";
import { NFTCombobox } from "~~/components/NFTComboBox";
//fetch user listed nfts
//fetch user owned nfts
// 

export default function Profile() {
  return (
    <div>
      {
        <div>
          <ProfileHeader />
          <MobileFilters />
          {/* <Filters /> */}
          <NFTLists />
          
        </div>
      }
    </div>
  );
}
