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
          <span>Listing price</span>
          <span className="text-lg font-bold">{listingPrice}</span>
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-2 lg:flex-row">
        <Button disabled variant="outline" className="w-full">
          Add to Cart
        </Button>
        <Button
          onClick={() => {
            console.log(collectionaddress, nftId);
          }}
          className="w-full"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export { BuyButton };
