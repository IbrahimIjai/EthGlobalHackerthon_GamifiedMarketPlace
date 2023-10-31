import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/Buttons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { QRCodeSVG } from "qrcode.react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDisconnect, useSwitchNetwork } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Address, Balance, BlockieAvatar } from "~~/components/scaffold-eth";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "~~/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~~/components/ui/DropdownMenu";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getBlockExplorerAddressLink, getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  useAutoConnect();
  const router = useRouter();
  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const [addressCopied, setAddressCopied] = useState(false);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(getTargetNetwork(), account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <Button className="" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="gap-1 btn btn-error btn-sm dropdown-toggle">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="w-4 h-6 ml-2 sm:ml-0" />
                    </label>
                    <ul
                      tabIndex={0}
                      className="gap-1 p-2 mt-1 dropdown-content menu shadow-center shadow-accent bg-muted rounded-box"
                    >
                      <li>
                        <button
                          className="btn-sm !rounded-xl flex py-3 gap-3"
                          type="button"
                          onClick={() => switchNetwork?.(configuredNetwork.id)}
                        >
                          <ArrowsRightLeftIcon className="w-4 h-6 ml-2 sm:ml-0" />
                          <span className="whitespace-nowrap">
                            Switch to <span style={{ color: networkColor }}>{configuredNetwork.name}</span>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="menu-item text-error btn-sm !rounded-xl flex gap-3 py-3"
                          type="button"
                          onClick={() => disconnect()}
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-6 ml-2 sm:ml-0" /> <span>Disconnect</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              }

              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1">
                        <BlockieAvatar address={account.address} size={30} ensImage={account.ensAvatar} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=" w-80">
                      <div className="flex items-center justify-between w-full p-2">
                        <div className="flex items-center gap-3 p-3">
                          <BlockieAvatar address={account.address} size={30} ensImage={account.ensAvatar} />
                          <div className="flex flex-col items-start justify-start">
                            <span className="font-bold">{account.displayName}</span>
                            {addressCopied ? (
                              <div className=" !rounded-xl flex gap-3 ">
                                <CheckCircleIcon
                                  className="w-4 h-5 text-xl font-normal cursor-pointer"
                                  aria-hidden="true"
                                />
                                <span className="text-sm whitespace-nowrap">Copied!</span>
                              </div>
                            ) : (
                              <CopyToClipboard
                                text={account.address}
                                onCopy={() => {
                                  setAddressCopied(true);
                                  setTimeout(() => {
                                    setAddressCopied(false);
                                  }, 800);
                                }}
                              >
                                <div className="flex gap-1 py-1 item-center ">
                                  <DocumentDuplicateIcon className="h-6 font-normal cursor-pointer" />
                                  <span className="text-sm whitespace-nowrap">Copy address</span>
                                </div>
                              </CopyToClipboard>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="flex gap-1 font-semibold text-red-700 3"
                          onClick={() => disconnect()}
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-6 lg:w-6 lg:h-8" />
                          <span className="whitespace-nowrap">Sign out</span>
                        </Button>
                      </div>
                      <DropdownMenuSeparator />
                      {/* <DropdownMenuItem>
                        <div>
                          <label htmlFor="qrcode-modal" className="btn-sm !rounded-xl flex gap-3 py-3">
                            <QrCodeIcon className="w-4 h-6 ml-2 sm:ml-0" />
                            <span className="whitespace-nowrap">View QR Code</span>
                          </label>
                        </div>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem className="flex items-center justify-between w-full p-2 font-bold">
                        <div className="flex items-center justify-between gap-2">
                          <QrCodeIcon className="w-4 h-6 ml-2 sm:ml-0" />
                          <span>View/Scan QR Code</span>
                        </div>
                        <ArrowRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => router.push(`/profile/${account.address}`)}
                        className="flex items-center justify-between w-full p-2 font-bold"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <UserIcon className="w-4 h-6 ml-2 sm:ml-0" />
                          <span>Profile</span>
                        </div>
                        <ArrowRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuItem>Balances</DropdownMenuItem>
                        <DropdownMenuItem>
                          Native:
                          <Balance address={account.address} className="h-auto min-h-0" />
                        </DropdownMenuItem>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

// <DropdownMenuItem>
// <Button className="flex w-full gap-3 py-3">
//   <ArrowTopRightOnSquareIcon className="w-4 h-6 ml-2 sm:ml-0" />
//   <a
//     target="_blank"
//     href={blockExplorerAddressLink}
//     rel="noopener noreferrer"
//     className="whitespace-nowrap"
//   >
//     View on Block Explorer
//   </a>
//   <label className="relative modal-box">
//     {/* dummy input to capture event onclick on modal box */}
//     <input className="absolute top-0 left-0 w-0 h-0" />
//     <label
//       htmlFor="qrcode-modal"
//       className="absolute btn btn-ghost btn-sm btn-circle right-3 top-3"
//     >
//       ✕
//     </label>
//     <div className="py-6 space-y-3">
//       <div className="flex flex-col items-center gap-6 space-x-4">
//         <QRCodeSVG value={account.address} size={256} />
//         <Address address={account.address} format="long" disableAddressLink />
//       </div>
//     </div>
//   </label>
// </Button>
// </DropdownMenuItem>

{
  /* <Dialog>
                        <DialogTrigger asChild className="flex items-center justify-between w-full p-2 font-bold">
                          <div className="flex items-center justify-between gap-2">
                            <QrCodeIcon className="w-4 h-6 ml-2 sm:ml-0" />
                            <span>View/Scan QR Code</span>
                          </div>
                          <ArrowRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Scan Qr Code</DialogTitle>
                            <DialogDescription>
                              <a
                                target="_blank"
                                href={blockExplorerAddressLink}
                                rel="noopener noreferrer"
                                className="whitespace-nowrap"
                              >
                                View on Block Explorer
                              </a>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-6 space-y-3">
                            <div className="flex flex-col items-center gap-6 space-x-4">
                              <QRCodeSVG value={account.address} size={256} />
                              <Address address={account.address} format="long" disableAddressLink />
                            </div>
                          </div>
                          <DialogFooter> </DialogFooter>
                        </DialogContent>
                      </Dialog> */
}
