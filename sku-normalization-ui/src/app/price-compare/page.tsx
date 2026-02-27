"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    ArrowLeft,
    TrendingDown,
    TrendingUp,
    Crown,
    Layers,
    Coins,
    BarChart3,
    ChevronDown,
    ChevronRight,
    Package,
    Search,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type SupplierOffer = {
    supplier_name: string;
    sku: string;
    raw_name: string;
    normalized_name: string;
    pack: string;
    unit_price: number;
    currency: string;
    price_per_kg: number | null;
    total_weight_kg: number | null;
};

type EquivalenceGroup = {
    id: string;
    canonical_name: string;
    category: string | null;
    offers: SupplierOffer[];
    best_price: number;
    worst_price: number;
    avg_price: number;
    savings_pct: number;
};

export default function PriceComparePage() {
    const [groups, setGroups] = useState<EquivalenceGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);

        // Fetch equivalence groups with their linked normalized SKUs and catalog items
        const { data, error } = await supabase
            .from('sku_equivalence_groups')
            .select(`
        id,
        canonical_name,
        category,
        normalized_skus(
          id,
          normalized_name,
          pack_info,
          total_weight_kg,
          price_per_kg,
          supplier: suppliers(name),
          catalog_item: supplier_catalog_items(sku, name, pack, unit_price, currency)
        )
      `)
            .order('canonical_name');

        if (error) {
            console.error("Error fetching groups:", error);
            setLoading(false);
            return;
        }

        if (data) {
            const processed: EquivalenceGroup[] = data.map((group: any) => {
                const offers: SupplierOffer[] = (group.normalized_skus || []).map((ns: any) => {
                    const supplier = Array.isArray(ns.supplier) ? ns.supplier[0] : ns.supplier;
                    const catalogItem = Array.isArray(ns.catalog_item) ? ns.catalog_item[0] : ns.catalog_item;

                    return {
                        supplier_name: supplier?.name || 'Unknown',
                        sku: catalogItem?.sku || '',
                        raw_name: catalogItem?.name || '',
                        normalized_name: ns.normalized_name || '',
                        pack: catalogItem?.pack || '',
                        unit_price: catalogItem?.unit_price || 0,
                        currency: catalogItem?.currency || 'AED',
                        price_per_kg: ns.price_per_kg,
                        total_weight_kg: ns.total_weight_kg,
                    };
                }).filter((o: SupplierOffer) => o.unit_price > 0);

                // Sort by unit_price ascending (cheapest first)
                offers.sort((a, b) => a.unit_price - b.unit_price);

                const prices = offers.map(o => o.unit_price);
                const bestPrice = prices.length > 0 ? Math.min(...prices) : 0;
                const worstPrice = prices.length > 0 ? Math.max(...prices) : 0;
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
                const savingsPct = worstPrice > 0 ? ((worstPrice - bestPrice) / worstPrice) * 100 : 0;

                return {
                    id: group.id,
                    canonical_name: group.canonical_name,
                    category: group.category,
                    offers,
                    best_price: bestPrice,
                    worst_price: worstPrice,
                    avg_price: avgPrice,
                    savings_pct: savingsPct,
                };
            }).filter((g: EquivalenceGroup) => g.offers.length > 0);

            // Sort by highest savings first
            processed.sort((a, b) => b.savings_pct - a.savings_pct);
            setGroups(processed);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredGroups = groups.filter(g =>
        g.canonical_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.offers.some(o => o.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.raw_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalProducts = groups.length;
    const totalOffers = groups.reduce((sum, g) => sum + g.offers.length, 0);
    const avgSavings = groups.length > 0
        ? groups.reduce((sum, g) => sum + g.savings_pct, 0) / groups.length : 0;
    const maxSavings = groups.length > 0
        ? Math.max(...groups.map(g => g.savings_pct)) : 0;

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-8 selection:bg-primary/30">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <BarChart3 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Price Comparison</h1>
                        </div>
                        <p className="text-muted-foreground max-w-xl text-sm ml-[52px]">
                            Compare prices across suppliers for equivalent products. Automatically generated from AI-normalized SKU equivalence groups.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products or suppliers..."
                                className="w-[280px] pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Product Groups</CardTitle>
                        <Layers className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Unique normalized products</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
                        <Package className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono">{totalOffers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Cross-supplier price points</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Price Spread</CardTitle>
                        <TrendingDown className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-emerald-500">
                            {avgSavings.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Average best-to-worst spread</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-xl border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Max Savings</CardTitle>
                        <Coins className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-amber-500">
                            {maxSavings.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Largest potential saving</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Comparison Table */}
            <div className="max-w-7xl mx-auto">
                <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Cross-Supplier Price Matrix</CardTitle>
                        <CardDescription>Click a product group to expand and see all supplier offers side by side</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[600px]">
                            <Table>
                                <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="w-[30px]"></TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center w-[80px]">Offers</TableHead>
                                        <TableHead className="text-right w-[120px]">Best Price</TableHead>
                                        <TableHead className="text-right w-[120px]">Worst Price</TableHead>
                                        <TableHead className="text-right w-[120px]">Spread</TableHead>
                                        <TableHead className="text-right w-[120px]">Best Supplier</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                Loading price data...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredGroups.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                {groups.length === 0
                                                    ? "No equivalence groups found. Upload a catalog and run the AI pipeline first."
                                                    : "No matching products found."
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredGroups.map((group) => (
                                            <React.Fragment key={group.id}>
                                                {/* Group Header Row */}
                                                <TableRow
                                                    className="border-border/50 cursor-pointer hover:bg-muted/40 transition-colors"
                                                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                                                >
                                                    <TableCell className="px-2">
                                                        {expandedGroup === group.id ?
                                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> :
                                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{group.canonical_name}</span>
                                                            {group.category && (
                                                                <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/50">
                                                                    {group.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                                            {group.offers.length}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-mono font-medium text-emerald-400">
                                                            {group.offers[0]?.currency} {group.best_price.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-mono text-muted-foreground">
                                                            {group.offers[0]?.currency} {group.worst_price.toFixed(2)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {group.savings_pct > 0 ? (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                                                                <span className="font-mono font-medium text-emerald-400">
                                                                    {group.savings_pct.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-xs">Same</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Crown className="w-3 h-3 text-amber-400" />
                                                            <span className="text-sm">{group.offers[0]?.supplier_name}</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded Offers */}
                                                {expandedGroup === group.id && (
                                                    <TableRow className="bg-muted/10 hover:bg-muted/10 border-border/30">
                                                        <TableCell colSpan={7} className="p-0">
                                                            <div className="px-8 py-4">
                                                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                                    All Supplier Offers for "{group.canonical_name}"
                                                                </h4>
                                                                <div className="rounded-lg border border-border/40 overflow-hidden">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-border/30">
                                                                                <TableHead className="text-xs">Rank</TableHead>
                                                                                <TableHead className="text-xs">Supplier</TableHead>
                                                                                <TableHead className="text-xs">Raw SKU Name</TableHead>
                                                                                <TableHead className="text-xs">SKU Code</TableHead>
                                                                                <TableHead className="text-xs">Pack</TableHead>
                                                                                <TableHead className="text-xs text-right">Unit Price</TableHead>
                                                                                <TableHead className="text-xs text-right">Price/kg</TableHead>
                                                                                <TableHead className="text-xs text-right">vs. Best</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {group.offers.map((offer, idx) => {
                                                                                const isBest = idx === 0;
                                                                                const isWorst = idx === group.offers.length - 1 && group.offers.length > 1;
                                                                                const pctVsBest = group.best_price > 0
                                                                                    ? ((offer.unit_price - group.best_price) / group.best_price) * 100
                                                                                    : 0;

                                                                                return (
                                                                                    <TableRow
                                                                                        key={`${group.id}-${offer.supplier_name}-${offer.sku}`}
                                                                                        className={`border-border/20 ${isBest ? 'bg-emerald-500/5' : ''} ${isWorst ? 'bg-red-500/5' : ''}`}
                                                                                    >
                                                                                        <TableCell>
                                                                                            {isBest ? (
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                                                                                                    <span className="text-xs text-emerald-400 font-medium">Best</span>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <span className="text-xs text-muted-foreground font-mono">#{idx + 1}</span>
                                                                                            )}
                                                                                        </TableCell>
                                                                                        <TableCell className="font-medium text-sm">{offer.supplier_name}</TableCell>
                                                                                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{offer.raw_name}</TableCell>
                                                                                        <TableCell>
                                                                                            <span className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded border border-border/40">{offer.sku}</span>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-sm">{offer.pack || '—'}</TableCell>
                                                                                        <TableCell className="text-right">
                                                                                            <span className={`font-mono font-medium ${isBest ? 'text-emerald-400' : isWorst ? 'text-red-400' : ''}`}>
                                                                                                {offer.currency} {offer.unit_price.toFixed(2)}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-right">
                                                                                            <span className="font-mono text-sm text-muted-foreground">
                                                                                                {offer.price_per_kg ? `${offer.currency} ${offer.price_per_kg.toFixed(2)}` : '—'}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-right">
                                                                                            {isBest ? (
                                                                                                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">Cheapest</Badge>
                                                                                            ) : (
                                                                                                <span className="font-mono text-sm text-red-400 flex items-center justify-end gap-0.5">
                                                                                                    <TrendingUp className="w-3 h-3" />
                                                                                                    +{pctVsBest.toFixed(1)}%
                                                                                                </span>
                                                                                            )}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                );
                                                                            })}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
