import React from "react";
import ProfileHeader from "~~/modules/profile/Header";
import MobileFilters from "~~/modules/profile/MobileFilters";

//fetch user listed nfts
//fetch user owned nfts

export default function Profile() {
  return (
    <div>
      {
        <div>
          <ProfileHeader />
          <MobileFilters />
        </div>
      }
    </div>
  );
}
