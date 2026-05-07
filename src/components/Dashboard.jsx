import { useEffect, useMemo, useState } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Alert,
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from "recharts";

import SummaryCard from "./SummaryCard";
import EmptyState from "./EmptyState";

const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#06b6d4",
    "#14b8a6",
    "#f43f5e",
    "#0ea5e9",
    "#84cc16",
];

export default function Dashboard({
    onUpload,
}) {
    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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

    ];

    // ================= FETCH =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    "http://localhost:5000/products/products"
                );

                const data =
                    await res.json();

                const formatted =
                    data.map((item) => {
                        const lastCategory =
                            item.category
                                ?.split("|")
                                ?.pop()
                                ?.trim();

                        return {
                            productId:
                                item.product_id,

                            productName:
                                item.product_name,

                            category:
                                categories.includes(
                                    lastCategory
                                )
                                    ? lastCategory
                                    : null,

                            discountedPrice:
                                Number(
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

                            ratingCount:
                                Number(
                                    item.rating_count
                                ),
                        };
                    });

                setProducts(formatted);
            } catch (err) {
                setError(
                    "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ================= STATS =================
    const stats = useMemo(() => {
        if (!products.length)
            return null;

        const totalProducts =
            products.length;

        const avgRating = (
            products.reduce(
                (s, p) =>
                    s +
                    (Number(
                        p.rating
                    ) || 0),
                0
            ) / totalProducts
        ).toFixed(1);

        const totalReviews =
            products.reduce(
                (s, p) =>
                    s +
                    (Number(
                        p.ratingCount
                    ) || 0),
                0
            );

        // ================= PRODUCTS PER CATEGORY =================
        const byCategory = {};

        categories.forEach((cat) => {
            byCategory[cat] = 0;
        });

        products.forEach((p) => {
            if (
                p.category &&
                byCategory[p.category] !==
                undefined
            ) {
                byCategory[p.category]++;
            }
        });

        const productsPerCategory =
            Object.entries(
                byCategory
            ).map(
                ([category, count]) => ({
                    category,
                    count,
                })
            );

        // ================= TOP REVIEWED =================
        const topReviewed = [
            ...products,
        ]
            .sort(
                (a, b) =>
                    (b.ratingCount ||
                        0) -
                    (a.ratingCount ||
                        0)
            )
            .slice(0, 5)
            .map((p) => ({
                name:
                    p.productName
                        ?.length > 18
                        ? p.productName.slice(
                            0,
                            18
                        ) + "..."
                        : p.productName,

                reviews:
                    p.ratingCount,
            }));

        // ================= DISCOUNT HISTOGRAM =================
        const buckets = [
            "0-10",
            "11-20",
            "21-30",
            "31-40",
            "41-50",
        ];

        const histMap =
            Object.fromEntries(
                buckets.map((b) => [
                    b,
                    0,
                ])
            );

        products.forEach((p) => {
            const d = Number(
                p.discountPercentage
            );

            if (d <= 10)
                histMap["0-10"]++;
            else if (d <= 20)
                histMap["11-20"]++;
            else if (d <= 30)
                histMap["21-30"]++;
            else if (d <= 40)
                histMap["31-40"]++;
            else
                histMap["41-50"]++;
        });

        const discountHist =
            buckets.map((b) => ({
                bucket: b,
                count: histMap[b],
            }));

        // ================= AVG RATING CATEGORY =================
        const catRating = {};

        categories.forEach((cat) => {
            catRating[cat] = {
                sum: 0,
                n: 0,
            };
        });

        products.forEach((p) => {
            if (
                p.category &&
                catRating[p.category]
            ) {
                catRating[
                    p.category
                ].sum +=
                    Number(
                        p.rating
                    ) || 0;

                catRating[
                    p.category
                ].n += 1;
            }
        });

        const avgRatingByCategory =
            Object.entries(
                catRating
            ).map(
                ([category, v]) => ({
                    category,

                    avg:
                        v.n > 0
                            ? Number(
                                (
                                    v.sum /
                                    v.n
                                ).toFixed(
                                    1
                                )
                            )
                            : 0,
                })
            );

        return {
            totalProducts,
            avgRating,
            totalReviews,
            productsPerCategory,
            topReviewed,
            discountHist,
            avgRatingByCategory,
        };
    }, [products]);

    // ================= LOADING =================
    if (loading) {
        return (
            <Box p={3}>
                <Skeleton
                    variant="rounded"
                    height={120}
                    sx={{
                        mb: 2,
                    }}
                />

                <Skeleton
                    variant="rounded"
                    height={500}
                />
            </Box>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    // ================= EMPTY =================
    if (!products.length) {
        return (
            <EmptyState
                onUpload={
                    onUpload
                }
            />
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",

                background:
                    "linear-gradient(180deg, #f1f5f9 0%, #eef2ff 100%)",

                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            {/* HEADER */}
            <Box mb={5}>
                <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{
                        color:
                            "#0f172a",

                        letterSpacing:
                            "-1px",
                    }}
                >
                    Product Dashboard
                </Typography>

                <Typography
                    mt={1}
                    sx={{
                        color:
                            "#64748b",

                        fontSize:
                            "15px",
                    }}
                >
                    Analytics
                    overview of
                    products,
                    reviews and
                    category
                    insights
                </Typography>
            </Box>

            {/* SUMMARY */}
            <Grid
                container
                spacing={4}
                mb={4}
            >
                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <SummaryCard
                        title="Total Products"
                        value={
                            stats.totalProducts
                        }
                        icon="bi-box-seam-fill"
                        gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                        trend="+12% this month"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <SummaryCard
                        title="Average Rating"
                        value={`${stats.avgRating} ★`}
                        icon="bi-star-fill"
                        gradient="linear-gradient(135deg,#ec4899,#f43f5e)"
                        trend="+4.2% increase"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <SummaryCard
                        title="Total Reviews"
                        value={
                            stats.totalReviews
                        }
                        icon="bi-chat-quote-fill"
                        gradient="linear-gradient(135deg,#10b981,#06b6d4)"
                        trend="+18% engagement"
                    />
                </Grid>
            </Grid>

            {/* CHARTS */}
            <Grid
                container
                spacing={4}
            >
                {/* ================= PRODUCTS PER CATEGORY ================= */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius:
                                "28px",

                            background:
                                "rgba(255,255,255,0.75)",

                            backdropFilter:
                                "blur(12px)",

                            border:
                                "1px solid #e2e8f0",

                            boxShadow:
                                "0 10px 40px rgba(15,23,42,0.08)",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 3.5,
                            }}
                        >
                            <Typography
                                fontWeight={
                                    700
                                }
                                fontSize="22px"
                                mb={1}
                            >
                                Products per
                                Category
                            </Typography>

                            <Typography
                                variant="body2"
                                color="#64748b"
                                mb={4}
                            >
                                Category
                                distribution
                                overview
                            </Typography>

                            <Box
                                sx={{
                                    width:
                                        "100%",

                                    height: 420,
                                }}
                            >
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={
                                            stats.productsPerCategory
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={
                                                false
                                            }
                                        />

                                        <XAxis
                                            dataKey="category"
                                            angle={
                                                -15
                                            }
                                            textAnchor="end"
                                            interval={
                                                0
                                            }
                                            height={
                                                80
                                            }
                                            tick={{
                                                fill: "#475569",

                                                fontSize: 12,
                                            }}
                                            axisLine={
                                                false
                                            }
                                            tickLine={
                                                false
                                            }
                                        />

                                        <YAxis
                                            axisLine={
                                                false
                                            }
                                            tickLine={
                                                false
                                            }
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="count"
                                            radius={[
                                                12,
                                                12,
                                                0,
                                                0,
                                            ]}
                                        >
                                            {stats.productsPerCategory.map(
                                                (
                                                    _,
                                                    i
                                                ) => (
                                                    <Cell
                                                        key={
                                                            i
                                                        }
                                                        fill={
                                                            COLORS[
                                                            i %
                                                            COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ================= TOP REVIEWED ================= */}
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <Card
                        sx={{
                            borderRadius:
                                "28px",
                            p: 2,
                        }}
                    >
                        <CardContent>
                            <Typography
                                fontWeight={
                                    700
                                }
                                mb={3}
                            >
                                Top Reviewed
                                Products
                            </Typography>

                            <Box
                                sx={{
                                    height: 320,
                                }}
                            >
                                <ResponsiveContainer>
                                    <BarChart
                                        data={
                                            stats.topReviewed
                                        }
                                        layout="vertical"
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={
                                                false
                                            }
                                        />

                                        <XAxis type="number" />

                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={
                                                140
                                            }
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="reviews"
                                            fill="#8b5cf6"
                                            radius={[
                                                0,
                                                12,
                                                12,
                                                0,
                                            ]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ================= DISCOUNT DISTRIBUTION ================= */}
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <Card
                        sx={{
                            borderRadius:
                                "28px",
                            p: 2,
                        }}
                    >
                        <CardContent>
                            <Typography
                                fontWeight={
                                    700
                                }
                                mb={3}
                            >
                                Discount
                                Distribution
                            </Typography>

                            <Box
                                sx={{
                                    height: 320,
                                }}
                            >
                                <ResponsiveContainer>
                                    <BarChart
                                        data={
                                            stats.discountHist
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={
                                                false
                                            }
                                        />

                                        <XAxis
                                            dataKey="bucket"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="count"
                                            fill="#10b981"
                                            radius={[
                                                12,
                                                12,
                                                0,
                                                0,
                                            ]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ================= AVG RATING BY CATEGORY ================= */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius:
                                "28px",

                            background:
                                "rgba(255,255,255,0.75)",

                            backdropFilter:
                                "blur(12px)",

                            border:
                                "1px solid #e2e8f0",

                            boxShadow:
                                "0 10px 40px rgba(15,23,42,0.08)",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 3.5,
                            }}
                        >
                            <Typography
                                fontWeight={
                                    700
                                }
                                fontSize="22px"
                                mb={1}
                            >
                                Category-wise
                                Average Rating
                            </Typography>

                            <Typography
                                variant="body2"
                                color="#64748b"
                                mb={4}
                            >
                                Average
                                ratings across
                                categories
                            </Typography>

                            <Box
                                sx={{
                                    width:
                                        "100%",

                                    height: 420,
                                }}
                            >
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={
                                            stats.avgRatingByCategory
                                        }
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={
                                                false
                                            }
                                        />

                                        <XAxis
                                            dataKey="category"
                                            angle={
                                                -15
                                            }
                                            textAnchor="end"
                                            interval={
                                                0
                                            }
                                            height={
                                                80
                                            }
                                        />

                                        <YAxis
                                            domain={[
                                                0,
                                                5,
                                            ]}
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="avg"
                                            fill="#ec4899"
                                            radius={[
                                                12,
                                                12,
                                                0,
                                                0,
                                            ]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
}