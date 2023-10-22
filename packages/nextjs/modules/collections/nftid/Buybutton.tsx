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
    <div className="bg-muted/40 p-4 rounded-lg flex gap-3 flex-col">
      <div className="w-full flex justify-start">
        <div className="flex flex-col items-start">
          <span>Listing price</span>
          <span className="font-bold text-lg">{listingPrice}</span>
        </div>
      </div>
      <div className="flex items-center flex-col lg:flex-row gap-2 w-full">
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

export {BuyButton}