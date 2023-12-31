import { Button } from "../ui/Buttons";
import { hardhat } from "wagmi/chains";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  return (
    <div className=" flex items-start justify-between w-full px-8 py-8 mt-6 ">
      <div className="flex flex-col gap-8 items-start ">
        <div className="flex space-x-2">
          {nativeCurrencyPrice > 0 && (
            <Button className="gap-0 font-normal border-none cursor-auto bg-primary btn-sm">
              <CurrencyDollarIcon className="h-4 w-4 mr-0.5" />
              <span>{nativeCurrencyPrice}</span>
            </Button>
          )}
          {getTargetNetwork().id === hardhat.id && <Faucet />}
        </div>
        <div className="w-full">
          <ul className="w-full ">
            <div className="flex items-center justify-center w-full gap-2 text-sm">
              <div>
                <p className="m-0 text-center">
                  Built with <HeartIcon className="inline-block w-4 h-4" /> with 🏰{" "}
                  <a
                    href="https://github.com/scaffold-eth/scaffold-eth-2/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    Scaffold-ETH 2
                  </a>
                </p>
              </div>
              <span>·</span>
              <div className="text-center">
                <a
                  href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  Support
                </a>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <SwitchTheme className="" />
    </div>
  );
};
