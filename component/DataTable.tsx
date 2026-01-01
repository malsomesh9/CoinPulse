import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Trending } from "@/types";

interface DataTableProps {
  data: Trending[];
}

const DataTable = ({ data }: DataTableProps) => {
  return (
    <Table>
      <TableCaption>Trending Coins</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Coin</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">24h Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell>{coin.market_cap_rank}</TableCell>
            <TableCell className="font-medium flex items-center gap-2">
              <div className="relative w-8 h-8">
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="rounded-full w-8 h-8 object-cover"
                />
              </div>
              <span>{coin.name}</span>
            </TableCell>
            <TableCell>{coin.symbol}</TableCell>
            <TableCell className="text-right">
              {coin.data?.price || "N/A"}
            </TableCell>
            <TableCell
              className={`text-right ${(coin.data?.price_change_percentage_24h?.usd || 0) > 0
                  ? "text-green-500"
                  : "text-red-500"
                }`}
            >
              {coin.data?.price_change_percentage_24h?.usd
                ? `${coin.data.price_change_percentage_24h.usd.toFixed(2)}%`
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;

