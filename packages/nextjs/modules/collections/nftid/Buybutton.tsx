import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/Buttons";

const BuyButton = ({
  listingPrice,
  nftId,
  collectionaddress,
}: {
  collectionaddress: string | string[] | undefined;
  nftId: string | number;
  listingPrice: string;
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/40">
      <div className="flex justify-start w-full">
        <div className="flex flex-col items-start">
          <span>Current price</span>
          <span className="text-lg font-bold">{listingPrice}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <Button
          variant="outline"
          className="w-full p-6 text-xl cursor-pointer hover:bg-foreground/30 hover:text-background"
        >
          Add to Cart
        </Button>
        <Button
          onClick={() => {
            console.log(collectionaddress, nftId);
          }}
          className="w-full p-6 text-xl"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export { BuyButton };
