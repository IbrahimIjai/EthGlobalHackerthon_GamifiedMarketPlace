import React from "react";
import { useRouter } from "next/router";
import Filters from "./Filters";
import { ChevronDown, RefreshCcw } from "lucide-react";
import CollectionNfts from "~~/components/CollectionNfts";
import { NFTCombobox } from "~~/components/NFTComboBox";
import { Button, buttonVariants } from "~~/components/ui/Buttons";
import { Checkbox } from "~~/components/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/DropdownMenu";
import { Input } from "~~/components/ui/Input";
import { Label } from "~~/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "~~/components/ui/RadioGroup";
import { ScrollArea } from "~~/components/ui/ScrollArea";
import { Separator } from "~~/components/ui/Seperator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~~/components/ui/Sheets";
import { Slider } from "~~/components/ui/Slider";
import { sortOptions, sortStatus } from "~~/config/collections";
import { useDebounce } from "~~/hooks/use-debounce";
import { collections } from "~~/utils/collections";

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

  //price filter
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500]);
  const debouncedPrice = useDebounce(priceRange, 500);

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
      <div className="flex flex-wrap items-center w-full space-x-2 lg:flex-nowrap">
        <NFTCombobox />
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Filter products" size="sm" disabled={isPending}>
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-8 py-12 lg:gap-2">
            <SheetTitle>Filters</SheetTitle>
            <Separator />
            <div>
              <h3 className="my-4 text-sm font-medium tracking-wide text-foreground">NFTs Status</h3>
              {sortStatus?.length > 0 && (
                <RadioGroup defaultValue="show all" className="flex font-bold border-accent">
                  {sortStatus.map((status, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div>
                        <RadioGroupItem value={status.label} id={status.label} className="sr-only peer" />
                        <Label
                          htmlFor={status.label}
                          className={buttonVariants({
                            variant: "outline",
                            className: " peer-data-[state=checked]:bg-primary cursor-pointer",
                          })}
                        >
                          {status.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-5 px-1 overflow-hidden">
              <div className="flex flex-col gap-6 space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">Price range ($)</h3>
                <Slider
                  variant="range"
                  thickness="thin"
                  defaultValue={[0, 500]}
                  max={500}
                  step={1}
                  value={priceRange}
                  onValueChange={(value: typeof priceRange) => setPriceRange(value)}
                />
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={priceRange[1]}
                    className="h-9"
                    value={priceRange[0]}
                    onChange={e => {
                      const value = Number(e.target.value);
                      setPriceRange([value, priceRange[1]]);
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
                    onChange={e => {
                      const value = Number(e.target.value);
                      setPriceRange([priceRange[0], value]);
                    }}
                  />
                </div>
              </div>
              {/* {categories?.length ? (
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
              ) : null} */}
            </div>
            <Separator />
            <div className="flex flex-col gap-5 px-1 overflow-hidden">
              {collections?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <h3 className="flex-1 text-sm font-medium tracking-wide text-foreground">Collections</h3>
                  </div>
                  <ScrollArea className="">
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
            <Separator className="my-4" />
            {/* <SheetFooter> */}
            <Button
              // aria-label="Clear filters"
              // size="sm"
              className="w-full"
              variant="default"
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
              // disabled={isPending}
            >
              Clear Filters
            </Button>
            {/* </SheetFooter> */}
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

        <Button variant="outline">
          <RefreshCcw className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <CollectionNfts />
    </div>
  );
}
