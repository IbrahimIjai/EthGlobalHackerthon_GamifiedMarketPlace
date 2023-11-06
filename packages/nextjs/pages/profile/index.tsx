import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

// import { nftsBaseUrl } from 'views/Nft/market/constants'

const ProfilePage = () => {
  const { address: account } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account.toLowerCase()}`);
    } else {
      router.push("/");
    }
  }, [account, router]);

  return null;
};

export default ProfilePage;
