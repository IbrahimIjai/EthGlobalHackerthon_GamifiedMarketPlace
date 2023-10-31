import React, { useState } from "react";
import Filters from "./Filters";
import { FaSortAmountUp } from "react-icons/fa";
import { Button } from "~~/components/ui/Buttons";
import { ScrollArea } from "~~/components/ui/ScrollArea";
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/Sheets";

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <FaSortAmountUp className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="pl-1 pr-0">
        <ScrollArea className="pb-10 pl-6 my-4">
          <div className="pl-1 pr-7">
            <Filters />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
