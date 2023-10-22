import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MobileMenu from "./MobileMenu";
import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-muted shadow-sm" : ""
      } hover:bg-muted hover:shadow-sm py-1.5 px-3 text-sm rounded-md gap-2`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const divRef = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState(0);
  // useEffect(() => {
  //   const divElement = divRef.current;

  //   if (divElement) {
  //     const rect = divElement?.getBoundingClientRect();
  //     const topDistance = rect.top + window.scrollY;
  //     const height = divElement.offsetHeight;
  //     setMarginTop(topDistance + height);
  //     console.log("height header", height);
  //   }
  // }, [marginTop]);

  const navLinks = (
    <>
      <li>
        <NavLink href="/collections">Collections</NavLink>
      </li>
      <li>
        <NavLink href="/launchpad">Launchpad</NavLink>
      </li>
      <li>
        <NavLink href="/airdrops">Airdrop</NavLink>
      </li>
      {/* <li>
        <NavLink href="/debug">
          <BugAntIcon className="w-4 h-4" />
          Debug Contracts
        </NavLink>
      </li>
      <li>
        <NavLink href="/blockexplorer">
          <MagnifyingGlassIcon className="w-4 h-4" />
          Block Explorer
        </NavLink>
      </li> */}
    </>
  );

  return (
    <div ref={divRef} className="fixed top-0 z-20 h-[60px] w-full px-2 shadow-md bg-background shadow-secondary">
      <div className="relative flex justify-between w-full min-h-0 px-0 py-4 sm:px-2">
        <div className="flex w-auto gap-3 item-center lg:w-1/2">
          <Link href="/" passHref className="items-center hidden gap-2 ml-4 mr-[5rem] lg:flex shrink-0">
            <div className="flex flex-col item-center h-[2rem]">
              <span className="text-xl font-bold">MARTIAN</span>
              <span className="text-[0.9rem] -mt-2">Market</span>
            </div>
          </Link>
          <ul className="flex-row hidden gap-2 px-1 lg:flex lg:flex-nowrap">{navLinks}</ul>
        </div>
        <div className="relative flex justify-end flex-grow w-1/2 gap-2 mr-4">
          <RainbowKitCustomConnectButton />
          <FaucetButton />
          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="lg:hidden dropdown" ref={burgerMenuRef}>
<div
  tabIndex={0}
  className={`ml-1 bg-slate-50 text-foreground ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
  onClick={() => {
    setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
  }}
>
  <Bars3Icon className="text-red-200 h-1/2" />
</div>
{isDrawerOpen && (
  <ul
    tabIndex={0}
    className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-primary rounded-box w-52"
    onClick={() => {
      setIsDrawerOpen(false);
    }}
  >
    {navLinks}
  </ul>
)}
</div> */
}
