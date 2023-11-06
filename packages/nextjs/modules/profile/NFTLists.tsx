import React from "react";
import { useRouter } from "next/router";
import Filters from "./Filters";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { NFTCombobox } from "~~/components/NFTComboBox";
import { Button } from "~~/components/ui/Buttons";
import { Checkbox } from "~~/components/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/DropdownMenu";
import { Label } from "~~/components/ui/Label";
import { ScrollArea } from "~~/components/ui/ScrollArea";
import { Separator } from "~~/components/ui/Seperator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~~/components/ui/Sheets";
import { sortOptions } from "~~/config/collections";
import { useDebounce } from "~~/hooks/use-debounce";
import { collections } from "~~/utils/collections";
import { Input } from "~~/components/ui/Input";

export default function NFTLists() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { pathname, query } = router;
  console.log("this  searchparams and pathname", pathname, query);
  console.log(collections);
  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(query?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [query],
  );
  // const debouncedPrice = useDebounce(priceRange, 500)

  // React.useEffect(() => {
  //   const [min, max] = debouncedPrice
  //   startTransition(() => {
  //     router.push(
  //       `${pathname}?${createQueryString({
  //         price_range: `${min}-${max}`,
  //       })}`,
  //       {
  //         scroll: false,
  //       }
  //     )
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedPrice])

  // Category filter
  //    const [selectedCategories, setSelectedCategories] = React.useState<
  //    Option[] | null
  //  >(null)

  // React.useEffect(() => {
  //   startTransition(() => {
  //     router.push(
  //       `${pathname}?${createQueryString({
  //         categories: selectedCategories?.length
  //           ? // Join categories with a dot to make search params prettier
  //             selectedCategories.map((c) => c.value).join(".")
  //           : null,
  //       })}`,
  //       {
  //         scroll: false,
  //       }
  //     )
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedCategories])

  // React.useEffect(() => {
  //   startTransition(() => {
  //     router.push(
  //       `${pathname}?${createQueryString({
  //         subcategories: selectedSubcategories?.length
  //           ? selectedSubcategories.map((s) => s.value).join(".")
  //           : null,
  //       })}`,
  //       {
  //         scroll: false,
  //       }
  //     )
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedSubcategories])
  // Store filter
  // const [storeIds, setStoreIds] = React.useState<number[] | null>(
  //   store_ids?.split(".").map(Number) ?? null
  // )
  return (
    <div>
      <div className="flex items-center w-full space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Filter products" size="sm" disabled={isPending}>
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="px-1 bg-red-600">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <div>
            <h3 className="text-sm font-medium tracking-wide text-foreground">
                  Status
                </h3>
            </div>
            <div className="flex flex-col flex-1 gap-5 px-1 overflow-hidden">
              <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">
                  Price range ($)
                </h3>
                <Slider
                  variant="range"
                  thickness="thin"
                  defaultValue={[0, 500]}
                  max={500}
                  step={1}
                  value={priceRange}
                  onValueChange={(value: typeof priceRange) =>
                    setPriceRange(value)
                  }
                />
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={priceRange[1]}
                    className="h-9"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setPriceRange([value, priceRange[1]])
                    }}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={priceRange[0]}
                    max={500}
                    className="h-9"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setPriceRange([priceRange[0], value])
                    }}
                  />
                </div>
              </div>
              {categories?.length ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    Categories
                  </h3>
                  <MultiSelect
                    placeholder="Select categories"
                    selected={selectedCategories}
                    setSelected={setSelectedCategories}
                    options={categories.map((c) => ({
                      label: toTitleCase(c),
                      value: c,
                    }))}
                  />
                </div>
              ) : null}
              {category ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    Subcategories
                  </h3>
                  <MultiSelect
                    placeholder="Select subcategories"
                    selected={selectedSubcategories}
                    setSelected={setSelectedSubcategories}
                    options={subcategories}
                  />
                </div>
              ) : null}
              {stores?.length ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <h3 className="flex-1 text-sm font-medium tracking-wide text-foreground">
                      Stores
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          startTransition(() => {
                            router.push(
                              `${pathname}?${createQueryString({
                                store_page: Number(store_page) - 1,
                              })}`
                            )
                          })
                        }}
                        disabled={Number(store_page) === 1 || isPending}
                      >
                        <Icons.chevronLeft
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Previous store page</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          startTransition(() => {
                            router.push(
                              `${pathname}?${createQueryString({
                                store_page: Number(store_page) + 1,
                              })}`
                            )
                          })
                        }}
                        disabled={
                          Number(store_page) === storePageCount || isPending
                        }
                      >
                        <Icons.chevronRight
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Next store page</span>
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100%-10rem)]">
                    <div className="space-y-4">
                      {stores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`store-${store.id}`}
                            checked={storeIds?.includes(store.id) ?? false}
                            onCheckedChange={(value) => {
                              if (value) {
                                setStoreIds([...(storeIds ?? []), store.id])
                              } else {
                                setStoreIds(
                                  storeIds?.filter((id) => id !== store.id) ??
                                    null
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor={`store-${store.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {truncate(store.name, 20)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col flex-1 gap-5 px-1 overflow-hidden">
              {collections?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <h3 className="flex-1 text-sm font-medium tracking-wide text-foreground">Collections</h3>
                  </div>
                  <ScrollArea className="min-h-[calc(100%-10rem)]">
                    <div className="space-y-4">
                      {collections.map(collection => (
                        <div key={collection.symbol} className="flex items-center space-x-2">
                          <Checkbox
                            id={`collection-${collection.symbol}`}
                            // checked={storeIds?.includes(collection.id) ?? false}
                            // onCheckedChange={value => {
                            //   if (value) {
                            //     setStoreIds([...(storeIds ?? []), collection.id]);
                            //   } else {
                            //     setStoreIds(storeIds?.filter(id => id !== collection.id) ?? null);
                            //   }
                            // }}
                          />
                          <Label
                            htmlFor={`collection-${collection.symbol}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {collection.name}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* <Filters/> */}
                  </ScrollArea>
                </div>
              )}
            </div>
            <div>
              <Separator className="my-4" />
              <SheetFooter>
                <Button
                  aria-label="Clear filters"
                  size="sm"
                  className="w-full"
                  // onClick={() => {
                  //   startTransition(() => {
                  //     router.push(
                  //       `${pathname}?${createQueryString({
                  //         price_range: 0 - 100,
                  //         store_ids: null,
                  //         categories: null,
                  //         subcategories: null,
                  //       })}`,
                  //     );

                  //     setPriceRange([0, 100]);
                  //     setSelectedCategories(null);
                  //     setSelectedSubcategories(null);
                  //     setStoreIds(null);
                  //   });
                  // }}
                  disabled={isPending}
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort products" className="flex whitespace-nowrap" size="sm" disabled={isPending}>
              Sort By
              <ChevronDown className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.label}
                // className={cn(option.value === sort && "font-bold")}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}`,
                      // {
                      //   scroll: false,
                      // },
                    );
                  });
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <NFTCombobox />
        <Button variant="outline">
          <RefreshCcw className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
