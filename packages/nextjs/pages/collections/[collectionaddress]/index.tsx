import type { NextPage } from "next";
import Activities from "~~/modules/collections/collectionId/Activities";
import CollectionHead from "~~/modules/collections/collectionId/Head";
import Listings from "~~/modules/collections/collectionId/Listings";

const CollectionIdPage: NextPage = () => {
  return (
    <div className="mx-1 lg:mx-4">
      <CollectionHead />

      <div className="lg:grid grid-cols-7 gap-8">
        <Listings />
        <Activities />
      </div>
    </div>
  );
};

export default CollectionIdPage;
