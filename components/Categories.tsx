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

interface CategoryProps {
    data: Category[];
}

const CategoryTable = ({ data }: CategoryProps) => {
    return (
        <Table>
            <TableCaption>Coin Categories</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Top 3 Coins</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">Volume 24h</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((category, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                {category.top_3_coins.map((coinUrl, idx) => (
                                    <img
                                        key={idx}
                                        src={coinUrl}
                                        alt={`Top coin ${idx + 1}`}
                                        className="rounded-full w-6 h-6 object-cover"
                                    />
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            ${category.market_cap.toLocaleString()}
                        </TableCell>
                        <TableCell
                            className={`text-right ${category.market_cap_change_24h > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                        >
                            {category.market_cap_change_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                            ${category.volume_24h.toLocaleString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default CategoryTable;