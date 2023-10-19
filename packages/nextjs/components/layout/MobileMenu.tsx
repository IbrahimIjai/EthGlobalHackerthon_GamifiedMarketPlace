


import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Sheet, SheetContent, SheetTrigger } from "../ui/Sheets";
import { Button } from "../ui/Buttons";
import { ScrollArea } from "../ui/ScrollArea";

import { cn } from "~~/lib/utils";
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <AiOutlineMenuUnfold className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
    children?: React.ReactNode
    href?: string
    disabled?: boolean
    pathname: string
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
function MobileLink({
    children,
    href,
    disabled,
    pathname,
    setIsOpen,
  }: MobileLinkProps) {
    return (
     <>
      <div
        // href={href}
        className={cn(
          "text-foreground/70 transition-colors hover:text-foreground",
          pathname === href && "text-foreground",
          disabled && "pointer-events-none opacity-60"
        )}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </div>
     </>
    )
  }
  