import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Address } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/Buttons";
import { ScrollArea } from "~~/components/ui/ScrollArea";
import { Sheet, SheetContentNoOverlay, SheetTrigger } from "~~/components/ui/Sheets";
import { cn } from "~~/lib/utils";

export default function MobileHead() {
  const [isOpen, setIsOpen] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = useState(0);
  useEffect(() => {
    const divElement = divRef.current;

    if (divElement) {
      const rect = divElement?.getBoundingClientRect();
      const topDistance = rect.top + window.scrollY;
      const height = divElement.offsetHeight;
      setMarginTop(topDistance + height);
    //   console.log("Margin Top", marginTop);
    }
  }, [marginTop]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div ref={divRef} className="flex items-center gap-2 font-bold cursor-pointer">
          <div className="relative w-12 h-8 ">
            <Image
              src="https://martianmosaic.vercel.app/assets/collectionsbanner/boredape.webp"
              fill
              className="object-cover"
              alt="Collection slide show"
            />
          </div>
          <p>Collection Name</p>
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </SheetTrigger>
      <SheetContentNoOverlay side="top" className={`border-muted pl-1 pr-0 mt-[${marginTop.toString()}px]`}>
        <ScrollArea className="my-4 flex flex-col gap-8 items-start   pl-6">
          <div className="pl-1 pr-7 flex items-center gap-2">
            <p>Add to watchlist</p>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </div>
          <div className="flex items-center">
            <Address address="0xbFEaDb211974Ce290A0d8bc51b6FB230bde6bf5A" hasBlockie={false} />
            <Button variant="outline">ERC721</Button>
          </div>
          <div className="flex items-center">
            <p>Floor Price</p>
            <Button variant="outline">ERC721</Button>
          </div>
          <div className="flex items-center">
            <p>Royalty</p>
            <Button variant="outline">3%</Button>
          </div>
        </ScrollArea>
      </SheetContentNoOverlay>
    </Sheet>
  );
}

interface MobileLinkProps {
  children?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  pathname: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function MobileLink({ children, href, disabled, pathname, setIsOpen }: MobileLinkProps) {
  return (
    <>
      <div
        // href={href}
        className={cn(
          "text-foreground/70 transition-colors hover:text-foreground",
          pathname === href && "text-foreground",
          disabled && "pointer-events-none opacity-60",
        )}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </div>
    </>
  );
}
