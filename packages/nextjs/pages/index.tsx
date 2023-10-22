import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Heros from "~~/modules/home/Heros";
import TopCollectionsTable from "~~/modules/home/TopCollectionsTable";
const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <Heros/>
      <TopCollectionsTable/>
    </>
  );
};

export default Home;
