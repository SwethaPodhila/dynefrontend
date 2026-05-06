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
    Legend,
    Cell,
} from "recharts";

import SummaryCard from "./SummaryCard";
import EmptyState from "./EmptyState";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"];

function ChartCard({ title, subtitle, children }) {
    return (
        <Card
            sx={{
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
            }}
        >
            <CardContent>
                <Typography variant="h6" fontWeight={700}>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {subtitle}
                    </Typography>
                )}

                <Box sx={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ onUpload }) {

    // ---------------------------
    // 🔌 API STATE
    // ---------------------------
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ---------------------------
    // 🔌 FETCH FROM DB
    // ---------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch("http://localhost:5000/products/products");
                const data = await res.json();

                setProducts(data || []);

            } catch (err) {
                setError("Failed to load dashboard data ❌");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ---------------------------
    // 📊 CALCULATIONS (UNCHANGED LOGIC)
    // ---------------------------
    const stats = useMemo(() => {
        if (!products?.length) return null;

        const totalProducts = products.length;

        const avgRating = (
            products.reduce((s, p) => s + (Number(p.rating) || 0), 0) /
            totalProducts
        ).toFixed(2);

        const totalReviews = products.reduce(
            (s, p) => s + (Number(p.ratingCount) || 0),
            0
        );

        const byCategory = {};
        products.forEach((p) => {
            byCategory[p.category] = (byCategory[p.category] || 0) + 1;
        });

        const productsPerCategory = Object.entries(byCategory).map(
            ([category, count]) => ({ category, count })
        );

        const topReviewed = [...products]
            .sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0))
            .slice(0, 5)
            .map((p) => ({
                name: p.productName?.length > 16
                    ? p.productName.slice(0, 16) + "…"
                    : p.productName,
                reviews: p.ratingCount,
            }));

        const buckets = [
            "0-10", "11-20", "21-30", "31-40", "41-50",
            "51-60", "61-70", "71-80", "81-90", "91-100"
        ];

        const histMap = Object.fromEntries(buckets.map((b) => [b, 0]));

        products.forEach((p) => {
            const d = Math.min(100, Math.max(0, Number(p.discountPercentage) || 0));
            histMap[buckets[Math.min(9, Math.floor(d / 10))]]++;
        });

        const discountHist = buckets.map((b) => ({
            bucket: b,
            count: histMap[b],
        }));

        const catRating = {};
        products.forEach((p) => {
            if (!catRating[p.category]) {
                catRating[p.category] = { sum: 0, n: 0 };
            }
            catRating[p.category].sum += Number(p.rating) || 0;
            catRating[p.category].n += 1;
        });

        const avgRatingByCategory = Object.entries(catRating).map(
            ([category, v]) => ({
                category,
                avg: Number((v.sum / v.n).toFixed(2)),
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

    // ---------------------------
    // ⏳ LOADING UI
    // ---------------------------
    if (loading) {
        return (
            <Box>
                <Skeleton height={80} />
                <Skeleton height={300} />
                <Skeleton height={300} />
            </Box>
        );
    }

    // ---------------------------
    // ❌ ERROR UI
    // ---------------------------
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // ---------------------------
    // 📭 EMPTY STATE
    // ---------------------------
    if (!products.length) return <EmptyState onUpload={onUpload} />;

    return (
        <Box sx={{ p: 2, background: "#f8fafc", minHeight: "100vh" }}>

            {/* ================= SUMMARY ================= */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <SummaryCard title="Total Products" value={stats.totalProducts} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <SummaryCard title="Average Rating" value={`${stats.avgRating} ★`} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <SummaryCard title="Total Reviews" value={stats.totalReviews} />
                </Grid>
            </Grid>

            {/* ================= CHARTS ================= */}
            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Products per Category" subtitle="Distribution">
                        <BarChart data={stats.productsPerCategory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count">
                                {stats.productsPerCategory.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Top Reviewed Products">
                        <BarChart data={stats.topReviewed} layout="vertical">
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={120} />
                            <Tooltip />
                            <Bar dataKey="reviews" fill="#8b5cf6" />
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Discount Distribution">
                        <BarChart data={stats.discountHist}>
                            <XAxis dataKey="bucket" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Category Avg Rating">
                        <BarChart data={stats.avgRatingByCategory}>
                            <XAxis dataKey="category" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Bar dataKey="avg" fill="#ec4899" />
                        </BarChart>
                    </ChartCard>
                </Grid>

            </Grid>
        </Box>
    );
}