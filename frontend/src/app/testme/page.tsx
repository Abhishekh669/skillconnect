'use client'

import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fetchProducts } from "@/lib/actions/product/get/get-query";

export default function ProductList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 0 }) => fetchProducts(10, pageParam),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextOffset : undefined,
        initialPageParam: 0
    });

    console.log("this is the data comming from backend : ",data)

    const allProducts = data ? data.pages.flatMap(page => page.rows) : [];

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? allProducts.length + 1 : allProducts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5, //if the database query lacking then befer the last 5 index fetch talready 
    });

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) return;

        if (
            lastItem.index >= allProducts.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        allProducts.length,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <h2 className="text-xl font-bold p-4">Products ({allProducts.length})</h2>

            {status === "pending" && <p className="p-4">Loading...</p>}
            {status === "error" && <p className="p-4 text-red-500">Error: {error.message}</p>}

            <div
                ref={parentRef}
                className="List"
                style={{
                    height: `600px`,
                    width: `100%`,
                    overflow: 'auto',
                    border: '1px solid #ccc'
                }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const isLoaderRow = virtualRow.index > allProducts.length - 1;
                        const product = allProducts[virtualRow.index];

                        return (
                            <div
                                key={virtualRow.index}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    padding: "16px",
                                    backgroundColor: virtualRow.index % 2 === 0 ? '#fff' : '#f9f9f9',
                                    borderBottom: '1px solid #eee',
                                }}
                            >
                                {isLoaderRow
                                    ? hasNextPage
                                        ? 'Loading more...'
                                        : 'Nothing more to load'
                                    : (
                                        <div>
                                            <h3 className="text-lg font-semibold">{product.name}</h3>
                                            <p className="text-gray-600">Rs {product.price}</p>
                                        </div>
                                    )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {isFetchingNextPage && (
                <p className="p-4 text-center text-gray-500">Fetching more products...</p>
            )}
        </div>
    )
}
