import { useMemo } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell,
} from "recharts";

import SummaryCard from "./SummaryCard";
import EmptyState from "./EmptyState";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"];

function ChartCard({ title, subtitle, children }) {
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                    boxShadow: 6,
                },
            }}
        >
            <CardContent>
                <Box mb={2}>
                    <Typography variant="h6" fontWeight="600">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ width: "100%", height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ products, onUpload }) {
    const stats = useMemo(() => {
        if (!products.length) return null;

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
                name:
                    p.productName.length > 16
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

    if (!products.length) return <EmptyState onUpload={onUpload} />;

    return (
        <Box>
            {/* 🔹 Summary Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon="bi-box-seam-fill"
                        gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                        trend="All catalog items"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Average Rating"
                        value={`${stats.avgRating} ★`}
                        icon="bi-star-fill"
                        gradient="linear-gradient(135deg,#f59e0b,#ec4899)"
                        trend="Across all products"
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Total Reviews"
                        value={stats.totalReviews.toLocaleString()}
                        icon="bi-chat-quote-fill"
                        gradient="linear-gradient(135deg,#10b981,#06b6d4)"
                        trend="Customer feedback"
                    />
                </Grid>
            </Grid>

            {/* 🔹 Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ChartCard title="Products per Category" subtitle="Catalog distribution">
                        <BarChart data={stats.productsPerCategory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="category" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {stats.productsPerCategory.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Top Reviewed Products" subtitle="Most engaged items">
                        <BarChart data={stats.topReviewed} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={120} />
                            <Tooltip />
                            <Bar dataKey="reviews" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Discount Distribution" subtitle="Discount % spread">
                        <BarChart data={stats.discountHist}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="bucket" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Category Avg Rating" subtitle="Out of 5">
                        <BarChart data={stats.avgRatingByCategory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="category" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="avg" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ChartCard>
                </Grid>
            </Grid>
        </Box>
    );
}
