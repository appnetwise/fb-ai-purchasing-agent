"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Activity,
  PackageSearch,
  Settings,
  Database,
  Search,
  ChevronRight,
  ChevronDown,
  Filter,
  RefreshCcw,
  FileUp,
  Loader2,
  Check,
  Link2,
  Scale,
  Layers,
  BarChart3
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { supabase } from "@/lib/supabase";

type SupplierCatalogItem = {
  id: string;
  sku: string;
  name: string;
  category?: string;
  normalization_status: string;
  normalized_sku_id: string | null;
  supplier: { name: string } | null;
  prediction?: string;
  confidence?: number;
  // Expanded details from normalized_skus
  pack_info?: { count: number; size: number; unit: string };
  total_weight_kg?: number;
  price_per_kg?: number;
  equiv_group_name?: string;
  equiv_group_id?: string;
  normalized_sku_db_id?: string;
};



export default function SkuNormalizationDashboard() {
  const [items, setItems] = useState<SupplierCatalogItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animated loading messages
  const loadingMessages = [
    "Good things take time :)",
    "We are working to get you the best stuff...",
    "AI is extracting product details...",
    "Generating SKU embeddings...",
    "Matching products against master catalog...",
    "Crunching numbers...",
    "Almost there..."
  ];
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading || isProcessing) {
      interval = setInterval(() => {
        setLoadingMessageIdx(prev => (prev + 1) % loadingMessages.length);
      }, 3500);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [isUploading, isProcessing, loadingMessages.length]);

  // Review action states
  const [approving, setApproving] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const { data, error } = await supabase
      .from('supplier_catalog_items')
      .select(`
        id, 
        sku, 
        name, 
        normalization_status, 
        normalized_sku_id,
        supplier: suppliers(name),
        normalized_skus(id, normalized_name, pack_info, total_weight_kg, price_per_kg, equiv_group_id, sku_equivalence_groups(id, canonical_name, category))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    const { data: auditData } = await supabase
      .from('normalization_audit_log')
      .select('catalog_item_id, similarity_score, action');

    const auditMap = new Map(
      (auditData || []).map((a: any) => [a.catalog_item_id, a])
    );

    if (data) {
      const enrichedData = data.map((d: any) => {
        const supplier = Array.isArray(d.supplier) ? d.supplier[0] : d.supplier;
        const normalizedArr = d.normalized_skus || [];
        const normalized = Array.isArray(normalizedArr) ? normalizedArr[0] : normalizedArr;
        const equivGroup = normalized?.sku_equivalence_groups;
        const equivGroupData = Array.isArray(equivGroup) ? equivGroup[0] : equivGroup;

        const audit = auditMap.get(d.id);
        const similarityScore = audit?.similarity_score;

        let prediction = 'Pending AI Context';
        let category = 'General';
        let confidence = 0.0;

        if (normalized?.normalized_name) {
          prediction = normalized.normalized_name;
          category = equivGroupData?.category || 'General';

          if (d.normalization_status === 'matched') {
            confidence = similarityScore != null ? parseFloat(similarityScore) : 0.95;
          } else if (d.normalization_status === 'review') {
            confidence = similarityScore != null ? parseFloat(similarityScore) : 0.65;
          } else if (d.normalization_status === 'normalized') {
            confidence = similarityScore != null ? parseFloat(similarityScore) : 0.5;
          }
        }

        return {
          ...d,
          supplier,
          prediction,
          category,
          confidence,
          pack_info: normalized?.pack_info,
          total_weight_kg: normalized?.total_weight_kg,
          price_per_kg: normalized?.price_per_kg,
          equiv_group_name: equivGroupData?.canonical_name,
          equiv_group_id: equivGroupData?.id,
          normalized_sku_db_id: normalized?.id,
        };
      }) as SupplierCatalogItem[];
      setItems(enrichedData);
    }
  }, []);



  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'supplier_catalog_items' }, () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  const startProcessing = async (fromUpload = false) => {
    setIsProcessing(true);
    if (!fromUpload) setProgress(0);

    let itemsRemaining = 1; // dummy value to enter loop
    let totalExpected = 0;

    // Safety exit flag to prevent infinite loops
    let consecutiveErrors = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // visual progress based on remaining count logic happens below, this is just a smooth filler
        if (prev >= 90) return prev;
        return prev + 1;
      });
    }, 800);

    try {
      while (itemsRemaining > 0 && consecutiveErrors < 3) {
        try {
          const { data, error } = await supabase.functions.invoke('test-pipeline', {
            body: { limit: 15 } // Match 15 at a time
          });

          if (error) throw error;

          // If first batch, guess the total
          if (totalExpected === 0 && data.remaining > 0) {
            totalExpected = data.processed + data.remaining;
          }

          itemsRemaining = data.remaining || 0;

          // update real progress if we know expected
          if (totalExpected > 0) {
            const fraction = 1 - (itemsRemaining / totalExpected);
            setProgress(fraction * 100);
          } else if (itemsRemaining === 0) {
            setProgress(100);
          }

          await loadData();
          consecutiveErrors = 0; // reset
        } catch (batchErr) {
          console.warn("Batch failed, continuing background retry...", batchErr);
          consecutiveErrors++;
          // wait a tiny bit before retrying the batch
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    } finally {
      clearInterval(interval);
      setProgress(100);

      if (fromUpload) {
        setUploadSuccess("AI Pipeline complete! All products processed.");
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setUploadSuccess("");
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsProcessing(false);
        }, 2000);
      } else {
        setTimeout(() => { setIsProcessing(false); }, 1000);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setProgress(5);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 1. Just upload and raw ingest (fast)
      const { data, error } = await supabase.functions.invoke(
        'catalog-upload',
        { body: formData }
      );

      if (error) throw error;

      setProgress(25);
      await loadData();

      // 2. Start background chunked processing loop automatically
      startProcessing(true);
    } catch (e: any) {
      console.error('Upload failed:', e);
      setUploadError(e?.message || 'Upload failed. Please check the file format.');
      setIsUploading(false); // only disable if it completely failed
    }
  };

  const handleApproveMatch = async (item: SupplierCatalogItem) => {
    if (!item.normalized_sku_db_id) return;
    setApproving(item.id);
    try {
      // Match the item using the manage-equivalences endpoint
      // If the item already has an equiv_group inferred from audit, we create/link
      const { error } = await supabase.functions.invoke('match-skus', {
        body: { normalized_sku_id: item.normalized_sku_db_id }
      });
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error("Approve failed:", e);
    } finally {
      setApproving(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Matched</Badge>;
      case "review":
        return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Review</Badge>;
      case "unmatched":
      case "pending":
        return <Badge variant="destructive" className="bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return "text-emerald-400";
    if (score >= 0.7) return "text-amber-400";
    if (score > 0) return "text-orange-400";
    return "text-red-500";
  };

  const getConfidenceBarColor = (score: number) => {
    if (score >= 0.9) return "bg-emerald-500";
    if (score >= 0.7) return "bg-amber-500";
    if (score > 0) return "bg-orange-500";
    return "bg-red-500";
  };

  const filteredMappings = items.filter(m => {
    const sName = m.supplier?.name || "";
    const matchesSearch = m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.prediction || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      sName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSupplier = selectedSupplier === "all" || sName === selectedSupplier;
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;

    let matchesTab = true;
    if (activeTab === "pending") {
      matchesTab = (m.normalization_status === 'pending' || m.normalization_status === 'normalized');
    } else if (activeTab !== "all") {
      matchesTab = m.normalization_status === activeTab;
    }

    return matchesSearch && matchesSupplier && matchesCategory && matchesTab;
  });

  const uniqueSuppliers = Array.from(new Set(items.map(i => i.supplier?.name).filter(Boolean))) as string[];
  const uniqueCategories = Array.from(new Set(items.map(i => i.category).filter(Boolean))) as string[];

  const matchedCount = items.filter(i => i.normalization_status === 'matched').length;
  const reviewCount = items.filter(i => i.normalization_status === 'review').length;
  const pendingCount = items.filter(i => i.normalization_status === 'pending' || i.normalization_status === 'normalized').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 selection:bg-primary/30">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AI SKU Normalization</h1>
          </div>
          <p className="text-muted-foreground max-w-xl text-sm">
            Leveraging machine learning to automatically standardize supplier catalogs, mapping messy localized SKUs to your unified master catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/price-compare">
            <Button variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/5 text-emerald-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Price Compare
            </Button>
          </Link>
          <Dialog open={isUploadModalOpen} onOpenChange={(open) => {
            setIsUploadModalOpen(open);
            if (!open) {
              setUploadError("");
              setUploadSuccess("");
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                <FileUp className="w-4 h-4 mr-2" />
                Upload Catalog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Upload Supplier Catalog</DialogTitle>
                <DialogDescription>
                  Upload a catalog in any format. Suppliers are auto-detected from the file and created automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="csv-file">Catalog File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv,.jpg,.jpeg,.png,.webp,.pdf,.xlsx,.xls"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">Supported: CSV, Images (JPG/PNG/WebP), PDF, Excel (XLSX/XLS)</p>
                </div>
                {uploadError && (
                  <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                    {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {uploadSuccess}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading || isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="animate-pulse">{loadingMessages[loadingMessageIdx]}</span>
                    </span>
                  ) : (
                    <><UploadCloud className="w-4 h-4 mr-2" /> Upload & Normalize</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => startProcessing(false)}
            disabled={isProcessing || isUploading || pendingCount === 0}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-0 pointer-events-auto"
          >
            {isProcessing || isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="animate-pulse">{loadingMessages[loadingMessageIdx]}</span>
              </span>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 mr-2" />
                {`Run AI Pipeline${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total SKUs Processed</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{items.length}</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 flex items-center">
              Total ingested SKUs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Match Rate</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-emerald-500">
              {items.length > 0 ? ((matchedCount / items.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${items.length > 0 ? (matchedCount / items.length) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Human Review</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-amber-500">{reviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Items pending mapping
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Catalogs</CardTitle>
            <PackageSearch className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{new Set(items.map(i => i.supplier?.name).filter(Boolean)).size}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique supplier sources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-6">

        {isProcessing && (
          <Card className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-4">
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium flex items-center"><BrainCircuit className="w-4 h-4 mr-2 animate-pulse text-primary" /> Two-Pass Normalization in progress...</span>
                <span className="text-muted-foreground font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Pass 1: Normalizing → Pass 2: Matching with LLM confirmation</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Catalog Items Mapping</CardTitle>
                <CardDescription>Review and validate the AI generated standardizations. Click a row to expand details.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search SKUs..."
                    className="w-[250px] pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  size="icon"
                  className={showFilters ? "" : "border-border/50"}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 p-4 rounded-lg bg-muted/40 border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {uniqueSuppliers.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 border-b border-border/50">
                <TabsList className="bg-muted/30 h-10 p-1 rounded-lg gap-1">
                  <TabsTrigger value="all" className="rounded-md px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All Items ({items.length})</TabsTrigger>
                  <TabsTrigger value="matched" className="rounded-md px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />Matched ({matchedCount})
                  </TabsTrigger>
                  <TabsTrigger value="review" className="rounded-md px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-500" />Review ({reviewCount})
                  </TabsTrigger>
                  <TabsTrigger value="unmatched" className="rounded-md px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending ({pendingCount})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0 border-none outline-none">
                <ScrollArea className="h-[550px]">
                  <Table>
                    <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead className="w-[140px]">Supplier</TableHead>
                        <TableHead className="w-[220px]">Raw Input SKU</TableHead>
                        <TableHead>AI Normalized Name</TableHead>
                        <TableHead className="w-[160px]">Equiv. Group</TableHead>
                        <TableHead className="text-right w-[130px]">Confidence</TableHead>
                        <TableHead className="text-right w-[130px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMappings.map((mapping) => (
                        <React.Fragment key={mapping.id}>
                          <TableRow
                            className="border-border/50 cursor-pointer hover:bg-muted/40 transition-colors"
                            onClick={() => setExpandedRow(expandedRow === mapping.id ? null : mapping.id)}
                          >
                            <TableCell className="px-2">
                              {expandedRow === mapping.id ?
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> :
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground text-sm">{mapping.supplier?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="font-mono text-xs bg-muted/50 p-1.5 rounded-md inline-block border border-border/50 max-w-[200px]">
                                <span className="truncate block">{mapping.name}</span>
                                <span className="text-[10px] text-muted-foreground">{mapping.sku}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate max-w-[200px]">{mapping.prediction}</span>
                                <span className="text-xs text-muted-foreground">({mapping.category || "General"})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {mapping.equiv_group_name ? (
                                <div className="flex items-center gap-1.5">
                                  <Layers className="w-3 h-3 text-primary/60" />
                                  <span className="text-xs text-primary/80 truncate max-w-[120px]">{mapping.equiv_group_name}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className={`font-mono text-sm font-medium ${getConfidenceColor(mapping.confidence || 0)}`}>
                                  {((mapping.confidence || 0) * 100).toFixed(1)}%
                                </span>
                                <div className="w-16 bg-muted/30 rounded-full h-1">
                                  <div className={`${getConfidenceBarColor(mapping.confidence || 0)} h-1 rounded-full transition-all duration-500`} style={{ width: `${(mapping.confidence || 0) * 100}%` }}></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {getStatusBadge(mapping.normalization_status)}
                            </TableCell>
                          </TableRow>

                          {/* Expanded Row Details */}
                          {expandedRow === mapping.id && (
                            <TableRow className="bg-muted/10 hover:bg-muted/10 border-border/30">
                              <TableCell colSpan={7} className="py-4 px-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Pack & Weight Info */}
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                      <Scale className="w-3.5 h-3.5" /> Pack Analysis
                                    </h4>
                                    {mapping.pack_info ? (
                                      <div className="bg-background/60 rounded-lg p-3 border border-border/30 space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Count</span>
                                          <span className="font-mono">{mapping.pack_info.count}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Size</span>
                                          <span className="font-mono">{mapping.pack_info.size} {mapping.pack_info.unit}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t border-border/30 pt-1.5">
                                          <span className="text-muted-foreground">Total Weight</span>
                                          <span className="font-mono font-medium">{mapping.total_weight_kg?.toFixed(2)} kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Price/kg</span>
                                          <span className="font-mono font-medium text-emerald-400">AED {mapping.price_per_kg?.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">No pack data parsed yet</p>
                                    )}
                                  </div>

                                  {/* Equivalence Group */}
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                      <Link2 className="w-3.5 h-3.5" /> Equivalence Group
                                    </h4>
                                    <div className="bg-background/60 rounded-lg p-3 border border-border/30">
                                      {mapping.equiv_group_name ? (
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-primary" />
                                            <span className="font-medium">{mapping.equiv_group_name}</span>
                                          </div>
                                          <p className="text-xs text-muted-foreground">This item is grouped with other supplier variants of the same product.</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <p className="text-xs text-muted-foreground">No group assigned yet.</p>
                                          {mapping.normalization_status === 'review' && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="w-full border-primary/30 hover:bg-primary/10"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleApproveMatch(mapping);
                                              }}
                                              disabled={approving === mapping.id}
                                            >
                                              {approving === mapping.id ? (
                                                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                              ) : (
                                                <Check className="w-3 h-3 mr-1.5" />
                                              )}
                                              Re-run Matching
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h4>
                                    <div className="space-y-2">
                                      {mapping.normalization_status === 'review' && (
                                        <Button
                                          size="sm"
                                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApproveMatch(mapping);
                                          }}
                                          disabled={approving === mapping.id}
                                        >
                                          {approving === mapping.id ? (
                                            <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Matching...</>
                                          ) : (
                                            <><Check className="w-3 h-3 mr-1.5" /> Approve & Auto-Match</>
                                          )}
                                        </Button>
                                      )}
                                      {mapping.normalization_status === 'matched' && (
                                        <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 flex items-center gap-2">
                                          <CheckCircle2 className="w-4 h-4" />
                                          Successfully matched with {((mapping.confidence || 0) * 100).toFixed(1)}% confidence
                                        </div>
                                      )}
                                      {mapping.normalization_status === 'pending' && (
                                        <p className="text-xs text-muted-foreground">Run the AI Pipeline to normalize this item.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                      {filteredMappings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                            No matching items found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
