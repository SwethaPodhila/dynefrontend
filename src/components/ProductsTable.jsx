import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    Card,
    CardContent,
    Box,
    TextField,
    MenuItem,
    Typography,
    Chip,
    CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import StarIcon from "@mui/icons-material/Star";

import EmptyState from "./EmptyState";

// ================= STATIC CATEGORIES =================
const categories = [
    "All",

    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Sports",

    // Cable & Accessories
    "USBCables",
    "HDMICables",
    "PowerBanks",
    "SandwichMakers",

    // Computer Accessories
    "Pendrives",

    // TV & Entertainment
    "SmartTelevisions",
    "StandardTelevisions",

    // Mobile
    "Smartphones",
    "ScreenProtectors",

    // Extra
    "Others",
];

export default function ProductsTable({
    onUpload,
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState("All");
    const [rating, setRating] =
        useState("All");

    // ================= FETCH PRODUCTS =================
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    "https://dynebackend-production.up.railway.app/products/products"
                );

                console.log(res.data);

                const formattedProducts =
                    res.data.map((item) => ({
                        productId:
                            item.product_id,

                        productName:
                            item.product_name,

                        // last category only
                        category:
                            item.category
                                ?.split("|")
                                ?.pop()
                                ?.trim(),

                        discountedPrice: Number(
                            item.discounted_price
                        ),

                        discountPercentage:
                            Number(
                                item.discount_percentage?.replace(
                                    "%",
                                    ""
                                )
                            ),

                        rating: Number(
                            item.rating
                        ),

                        ratingCount: Number(
                            item.rating_count
                        ),
                    }));

                setProducts(
                    formattedProducts
                );
            } catch (err) {
                console.log(
                    "Products fetch error:",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // ================= FILTERS =================
    const filtered = useMemo(() => {

        // predefined categories except All & Others
        const knownCategories = categories
            .filter((c) => c !== "All" && c !== "Others")
            .map((c) => c.toLowerCase());

        return products
            .filter((p) =>
                p.productName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            )

            .filter((p) => {

                if (category === "All") {
                    return true;
                }

                // Others filter
                if (category === "Others") {
                    return !knownCategories.includes(
                        p.category?.toLowerCase()
                    );
                }

                return (
                    p.category?.toLowerCase() ===
                    category.toLowerCase()
                );
            })

            .filter(
                (p) =>
                    rating === "All" ||
                    Math.floor(Number(p.rating)) ===
                    Number(rating)
            );

    }, [products, search, category, rating]);

    // ================= LOADING =================
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={300}
            >
                <CircularProgress />
            </Box>
        );
    }

    // ================= EMPTY =================
    if (!products.length) {
        return (
            <EmptyState
                onUpload={onUpload}
            />
        );
    }

    // ================= COLUMNS =================
    const columns = [
        {
            field: "productId",
            headerName: "ID",
            width: 120,

            renderCell: (params) => (
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {params.value}
                </Typography>
            ),
        },

        {
            field: "productName",
            headerName: "Product",
            flex: 1,
            minWidth: 220,

            renderCell: (params) => (
                <Typography
                    fontWeight={600}
                >
                    {params.value}
                </Typography>
            ),
        },

        {
            field: "category",
            headerName: "Category",
            width: 180,

            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        background:
                            "#ede9fe",
                        color: "#5b21b6",
                        fontWeight: 600,
                    }}
                />
            ),
        },

        {
            field: "discountedPrice",
            headerName: "Price",
            width: 140,

            renderCell: (params) => (
                <Typography
                    fontWeight={700}
                    color="#111827"
                >
                    ₹
                    {Number(
                        params.value
                    ).toLocaleString()}
                </Typography>
            ),
        },

        {
            field: "discountPercentage",
            headerName: "Discount",
            width: 140,

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
                <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                >
                    <StarIcon
                        sx={{
                            color: "#f59e0b",
                            fontSize: 18,
                        }}
                    />

                    <Typography
                        fontWeight={600}
                    >
                        {Number(
                            params.value
                        ).toFixed(1)}
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
                    {Number(
                        params.value
                    ).toLocaleString()}
                </Typography>
            ),
        },
    ];

    // ================= UI =================
    return (
        <Card
            sx={{
                borderRadius: 4,
                boxShadow:
                    "0 10px 35px rgba(0,0,0,0.06)",
                border:
                    "1px solid #e5e7eb",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* FILTERS */}
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
                        sx={{
                            maxWidth: 520,
                        }}
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        select
                        label="Category"
                        size="small"
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        sx={{
                            minWidth: 220,
                        }}
                    >
                        {categories.map((c) => (
                            <MenuItem
                                key={c}
                                value={c}
                            >
                                {c === "All"
                                    ? "All Categories"
                                    : c}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Rating"
                        size="small"
                        value={rating}
                        onChange={(e) =>
                            setRating(
                                e.target.value
                            )
                        }
                        sx={{
                            minWidth: 180,
                        }}
                    >
                        <MenuItem value="All">
                            All Ratings
                        </MenuItem>

                        {[5, 4, 3, 2, 1].map(
                            (r) => (
                                <MenuItem
                                    key={r}
                                    value={r}
                                >
                                    {r}+ Stars
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Box>

                {/* TABLE */}
                <Box
                    sx={{
                        height: 520,
                        width: "100%",
                    }}
                >
                    <DataGrid
                        rows={filtered}
                        columns={columns}
                        getRowId={(row) =>
                            row.productId
                        }
                        pageSizeOptions={[
                            8,
                            15,
                            25,
                        ]}
                        initialState={{
                            pagination: {
                                paginationModel:
                                {
                                    pageSize: 8,
                                },
                            },
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            border: "none",

                            "& .MuiDataGrid-columnHeaders":
                            {
                                backgroundColor:
                                    "#f5f3ff",
                                color:
                                    "#4c1d95",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "15px",
                            },

                            "& .MuiDataGrid-row:hover":
                            {
                                backgroundColor:
                                    "#f8fafc",
                            },
                        }}
                    />
                </Box>

                {/* EMPTY FILTER */}
                {filtered.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        mt={3}
                        fontWeight={500}
                    >
                        🔍 No products match
                        your filters
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}