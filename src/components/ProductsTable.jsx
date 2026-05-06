import { useMemo, useState } from "react";
import {
    Card,
    CardContent,
    Box,
    TextField,
    MenuItem,
    Typography,
    Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import StarIcon from "@mui/icons-material/Star";

import EmptyState from "./EmptyState";

export default function ProductsTable({ products, onUpload }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [rating, setRating] = useState("All");

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
        [products]
    );

    const filtered = useMemo(() => {
        return products
            .filter((p) =>
                p.productName.toLowerCase().includes(search.toLowerCase())
            )
            .filter((p) => category === "All" || p.category === category)
            .filter(
                (p) => rating === "All" || Math.floor(p.rating) === Number(rating)
            );
    }, [products, search, category, rating]);

    if (!products.length) return <EmptyState onUpload={onUpload} />;

    const columns = [
        {
            field: "productId",
            headerName: "ID",
            width: 120,
            renderCell: (params) => (
                <Typography variant="caption" color="text.secondary">
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "productName",
            headerName: "Product",
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (
                <Typography fontWeight={600}>{params.value}</Typography>
            ),
        },
        {
            field: "category",
            headerName: "Category",
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        background: "#ede9fe",
                        color: "#5b21b6",
                        fontWeight: 500,
                    }}
                />
            ),
        },
        {
            field: "discountedPrice",
            headerName: "Price",
            width: 130,
            renderCell: (params) => (
                <Typography fontWeight={600}>
                    ₹{params.value.toLocaleString()}
                </Typography>
            ),
        },
        {
            field: "discountPercentage",
            headerName: "Discount",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={`${params.value}% OFF`}
                    color="success"
                    size="small"
                />
            ),
        },
        {
            field: "rating",
            headerName: "Rating",
            width: 120,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                    <Typography fontWeight={500}>
                        {Number(params.value).toFixed(1)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: "ratingCount",
            headerName: "Reviews",
            width: 140,
            renderCell: (params) => (
                <Typography color="text.secondary">
                    {params.value.toLocaleString()}
                </Typography>
            ),
        },
    ];

    return (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                {/* 🔍 Filters */}
                <Box
                    display="flex"
                    gap={2}
                    mb={3}
                    flexWrap="wrap"
                >
                    <TextField
                        label="Search Products"
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 300 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <TextField
                        select
                        label="Category"
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        {categories.map((c) => (
                            <MenuItem key={c} value={c}>
                                {c === "All" ? "All Categories" : c}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Rating"
                        size="small"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="All">All Ratings</MenuItem>
                        {[5, 4, 3, 2, 1].map((r) => (
                            <MenuItem key={r} value={r}>
                                {r}+ Stars
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                {/* 📊 Data Grid */}
                <Box sx={{ height: 450, width: "100%" }}>
                    <DataGrid
                        rows={filtered}
                        columns={columns}
                        getRowId={(row) => row.productId}
                        pageSizeOptions={[8]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 8 },
                            },
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#f5f3ff",
                                color: "#4c1d95",
                                fontWeight: "bold",
                            },
                        }}
                    />
                </Box>

                {/* Empty filter state */}
                {filtered.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        mt={3}
                    >
                        🔍 No products match your filters
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}