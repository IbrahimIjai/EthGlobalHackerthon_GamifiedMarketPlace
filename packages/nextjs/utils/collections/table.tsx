import { collections } from ".";
import { NFTCollection } from "./types";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/Avatar";

export const COLLECTION_COLUMN: ColumnDef<NFTCollection>[] = [
  {
    id: "serial",
    header: "",
    cell: ({ row }) => <div className="font-bold">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Collection",
    cell: ({ row }) => {
      const collectionName = row.getValue("name") as string;
      console.log(collectionName);
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>some collection</p>
        </div>
      );
    },
  },
  {
    accessorKey: "floorPrice",
    header: "Floor Price",
    cell: ({ row }) => {
      const collectionName = row.getValue("name") as string;
      console.log(collectionName);
      return (
        <div className="flex items-center gap-2">
          <p>2eth</p>
        </div>
      );
    },
  },
  {
    accessorKey: "volume",
    header: "Trading Volumn",
    cell: ({ row }) => {
      const collectionName = row.getValue("name") as string;
      console.log(collectionName);
      return (
        <div className="flex items-center gap-2">
          <p>2eth</p>
        </div>
      );
    },
  },
];
