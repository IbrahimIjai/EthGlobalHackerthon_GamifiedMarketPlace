import React from "react";
import type { NextPage } from "next";
import CollectionPageTable from "~~/modules/collections/Table";

const CollectionsPage: NextPage = () => {
  return (
    <div className="mx-1 lg:mx-4">
      <CollectionPageTable />
    </div>
  );
};

export default CollectionsPage;
