import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import Heros from "~~/modules/home/Heros";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <Heros/>
      
    </>
  );
};

export default Home;
