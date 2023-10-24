import React from "react";
import { useRouter } from "next/router";
import { Row } from "@tanstack/react-table";
import { DataTable } from "~~/components/datatable";
import { Button } from "~~/components/ui/Buttons";
import { Label } from "~~/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "~~/components/ui/RadioGroup";
import { collections } from "~~/utils/collections";
import { COLLECTION_COLUMN } from "~~/utils/collections/table";

export default function TopCollectionsTable() {
  const router = useRouter();

  const handleRowClick = (row: Row<any>) => {
    const _collection = row.original.contract.contract;
    router.push(`/collections/${_collection}`);
  };
  return (
    <div className="mt-8 mx-3">
      <div className="">
        <h1 className="title_h1 ">Real Time Data Tracking</h1>
        <div className="flex flex-col items-start lg:flex-row lg:items-center justify-between mt-8">
          <RadioGroup defaultValue="trending" className="flex font-bold border-accent">
            <div>
              <RadioGroupItem value="trending" id="trending" className="peer sr-only" />
              <Label
                htmlFor="trending"
                className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
              >
                🧑🏻‍🚀 Trending
              </Label>
            </div>
            <div>
              <RadioGroupItem value="watchlist" id="watchlist" className="peer sr-only" />
              <Label
                htmlFor="watchlist"
                className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
              >
                👓 Watchlist
              </Label>
            </div>
            <div>
              <RadioGroupItem value="highestvolume" id="highestvolume" className="peer sr-only" />
              <Label
                htmlFor="highestvolume"
                className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
              >
                🏋🏾‍♀️ Highest Volume
              </Label>
            </div>
          </RadioGroup>
          <div className="relative mt-5 lg:mt-0 flex justify-between lg:justify-end items-center gap-2">
            <RadioGroup defaultValue="1d" className="flex border-accent">
              <div>
                <RadioGroupItem value="6h" id="6h" className="peer sr-only" />
                <Label
                  htmlFor="6h"
                  className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
                >
                  6h
                </Label>
              </div>
              <div>
                <RadioGroupItem value="1d" id="1d" className="peer sr-only" />
                <Label
                  htmlFor="1d"
                  className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
                >
                  1d
                </Label>
              </div>
              <div>
                <RadioGroupItem value="7d" id="7d" className="peer sr-only" />
                <Label
                  htmlFor="7d"
                  className="border border-muted p-2 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary"
                >
                  7d
                </Label>
              </div>
            </RadioGroup>
            <Button variant="outline">View all</Button>
          </div>
        </div>
      </div>
      <DataTable onNavigateToDynamicPage={handleRowClick} data={collections.slice(0, 4)} columns={COLLECTION_COLUMN} />
    </div>
  );
}
