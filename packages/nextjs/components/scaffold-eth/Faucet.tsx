import { useEffect, useState } from "react";
import { Address as AddressType, createWalletClient, http, parseEther } from "viem";
import { useNetwork } from "wagmi";
import { hardhat } from "wagmi/chains";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput, Balance, EtherInput, getParsedError } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

import { Button } from "~~/components/ui/Buttons"
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/Dialog"
import { Label } from "~~/components/ui/Label"

// Account index to use from generated hardhat accounts.
const FAUCET_ACCOUNT_INDEX = 0;

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

/**
 * Faucet modal which lets you send ETH to any address.
 */
export const Faucet = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState<AddressType>();
  const [faucetAddress, setFaucetAddress] = useState<AddressType>();
  const [sendValue, setSendValue] = useState("");

  const { chain: ConnectedChain } = useNetwork();

  const faucetTxn = useTransactor(localWalletClient);

  useEffect(() => {
    const getFaucetAddress = async () => {
      try {
        const accounts = await localWalletClient.getAddresses();
        setFaucetAddress(accounts[FAUCET_ACCOUNT_INDEX]);
      } catch (error) {
        notification.error(
          <>
            <p className="mt-0 mb-1 font-bold">Cannot connect to local provider</p>
            <p className="m-0">
              - Did you forget to run <code className="text-base italic font-bold bg-muted">yarn chain</code> ?
            </p>
            <p className="mt-1 break-normal">
              - Or you can change <code className="text-base italic font-bold bg-muted">targetNetwork</code> in{" "}
              <code className="text-base italic font-bold bg-muted">scaffold.config.ts</code>
            </p>
          </>,
        );
        console.error("⚡️ ~ file: Faucet.tsx:getFaucetAddress ~ error", error);
      }
    };
    getFaucetAddress();
  }, []);

  const sendETH = async () => {
    if (!faucetAddress) {
      return;
    }
    try {
      setLoading(true);
      await faucetTxn({
        to: inputAddress,
        value: parseEther(sendValue as `${number}`),
        account: faucetAddress,
        chain: hardhat,
      });
      setLoading(false);
      setInputAddress(undefined);
      setSendValue("");
    } catch (error) {
      const parsedError = getParsedError(error);
      console.error("⚡️ ~ file: Faucet.tsx:sendETH ~ error", error);
      notification.error(parsedError);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">
      <BanknotesIcon className="w-4 h-4" />
      <span>Faucet</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
      </DialogHeader>
    <label  className="relative cursor-pointer">
        {/* dummy input to capture event onclick on modal box */}
        {/* <Input className="absolute top-0 left-0 w-0 h-0" /> */}
        <h3 className="mb-3 text-xl font-bold">Local Faucet</h3>
        <div className="space-y-3">
          <div className="flex space-x-4">
            <div>
              <span className="text-sm font-bold">From:</span>
              <Address address={faucetAddress} />
            </div>
            <div>
              <span className="pl-3 text-sm font-bold">Available:</span>
              <Balance address={faucetAddress} />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <AddressInput
              placeholder="Destination Address"
              value={inputAddress ?? ""}
              onChange={value => setInputAddress(value)}
            />
            <EtherInput placeholder="Amount to send" value={sendValue} onChange={value => setSendValue(value)} />
            <Button className="h-10 px-2" onClick={sendETH} disabled={loading}>
              {!loading ? (
                <BanknotesIcon className="w-6 h-6" />
              ) : (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              <span>Send</span>
            </Button>
          </div>
        </div>
    </label>
    </DialogContent>
  </Dialog>
  );
};




