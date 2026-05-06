import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StarIcon from "@mui/icons-material/Star";
import ReviewsIcon from "@mui/icons-material/Reviews";

function getIcon(icon) {
    switch (icon) {
        case "bi-box-seam-fill":
            return <Inventory2Icon />;
        case "bi-star-fill":
            return <StarIcon />;
        case "bi-chat-quote-fill":
            return <ReviewsIcon />;
        default:
            return <TrendingUpIcon />;
    }
}

export default function SummaryCard({
    title,
    value,
    icon,
    gradient,
    trend,
}) {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                },
            }}
        >
            {/* Gradient top bar */}
            <Box
                sx={{
                    height: 6,
                    background: gradient,
                }}
            />

            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between">

                    {/* Left Content */}
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                color: "text.secondary",
                                fontWeight: 600,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                color: "#1e1b4b",
                                lineHeight: 1.2,
                                mt: 1,
                            }}
                        >
                            {value}
                        </Typography>

                        {trend && (
                            <Box display="flex" alignItems="center" mt={1}>
                                <TrendingUpIcon
                                    sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{ color: "success.main", fontWeight: 600 }}
                                >
                                    {trend}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Icon Box */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            background: gradient,
                            boxShadow: 2,
                        }}
                    >
                        {getIcon(icon)}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}