import React from "react";
import NFTCard from "./cards/NFTCard";

export default function CollectionNfts() {
//   console.log(myArray);
  return (
    <div>
      <div className="grid grid-cols-2 gap-5 px-8 mt-8 lg:grid-cols-6">
      {myArray.map((card) => {
        return (
          <div key={card}>
            <NFTCard />
          </div>
        );
      })}
    </div>
    </div>
  );
}
const myArray = Array.from({ length: 100 }, (_, index) => index + 1);
