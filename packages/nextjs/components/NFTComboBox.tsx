"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
// import { filterProductsAction } from "@/app/_actions/product";
import { CircleIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";
import { Button } from "~~/components/ui/Buttons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~~/components/ui/Command";
import { Skeleton } from "~~/components/ui/Skeleton";
// import { type Product } from "~~/db/schema";
import { useDebounce } from "~~/hooks/use-debounce";
import { cn, isMacOs } from "~~/lib/utils";
// import { productCategories } from "@/config/products"
import { collections } from "~~/utils/collections";
import type { NFTToken } from "~~/utils/collections/types";

// interface ProductGroup {
//   category: Product["category"]
//   products: Pick<Product, "id" | "name" | "category">[]
// }

interface ProductGroup {
  category: NFTToken["name"];
  products: Pick<NFTToken, "description" | "name" | "attributes">[];
}

export function NFTCombobox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = React.useState<ProductGroup[] | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      return;
    }

    let mounted = true;

    function fetchData() {
      // startTransition(async () => {
      //   const data = await filterProductsAction(debouncedQuery);
      //   if (mounted) {
      //     setData(data);
      //   }
      // });
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(isOpen => !isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant="outline"
        className="relative my-4 lg:my-0 justify-start py-2 w-full px-4 gap-4 h-9"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 mr-2" aria-hidden="true" />
        <span className="inline-flex mr-2">Search Specific NFT...</span>
        <span className="sr-only">Search products</span>
        <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] opacity-100 flex">
          <abbr title={isMacOs() ? "Command" : "Control"}>{isMacOs() ? "⌘" : "Ctrl+"}</abbr>K
        </kbd>
      </Button>
      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        {/* <CommandInput placeholder="Search Your NFTs..." value={query} onValueChange={setQuery} /> */}
        <CommandInput placeholder="Search Your NFTs..." />
        <CommandList>
          <CommandEmpty className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}>
            No products found.
          </CommandEmpty>
          {isPending ? (
            <div className="px-1 py-2 space-y-1 overflow-hidden">
              <Skeleton className="w-10 h-4 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map(group => (
              <CommandGroup key={group.category} className="capitalize" heading={group.category}>
                {/* {group.products.map(item => {
                  const CategoryIcon =
                    // productCategories.find(
                    collections.find(category => category.name === group.category)?.name ?? CircleIcon;

                  return (
                    <CommandItem
                      key={item.name}
                      value={item.name}
                      onSelect={() => handleSelect(() => router.push(`/product/${item.name}`))}
                    >
                      <CategoryIcon className="w-4 h-4 mr-2 text-muted-foreground" aria-hidden="true" />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  );
                })} */}
                <CommandItem>
                  <span>Profile</span>
                </CommandItem>
                <CommandItem>
                  <span>Billing</span>
                </CommandItem>
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
