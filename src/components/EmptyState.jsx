import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function EmptyState({ onUpload }) {
    return (
        <Box
            sx={{
                textAlign: "center",
                p: 5,
                borderRadius: 3,
                boxShadow: 3,
                background: "linear-gradient(135deg,#ffffff 0%,#f5f3ff 100%)",
                border: "2px dashed #c7d2fe",
            }}
        >
            {/* Icon Circle */}
            <Box
                sx={{
                    mx: "auto",
                    mb: 4,
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#6366f1,#ec4899)",
                }}
            >
                <InboxIcon sx={{ fontSize: 48, color: "#fff" }} />
            </Box>

            {/* Title */}
            <Typography variant="h5" fontWeight="bold" mb={1}>
                📦 No products found
            </Typography>

            {/* Subtitle */}
            <Typography
                variant="body2"
                color="text.secondary"
                mb={4}
                sx={{ maxWidth: 480, mx: "auto" }}
            >
                Please upload a dataset to view analytics. Once data is available,
                you’ll see insights, charts, and product performance here.
            </Typography>

            {/* Button */}
            {onUpload && (
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<CloudUploadIcon />}
                    onClick={onUpload}
                    sx={{
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        "&:hover": {
                            background: "linear-gradient(135deg,#5b5cf6,#7c3aed)",
                        },
                    }}
                >
                    Go to Upload
                </Button>
            )}
        </Box>
    );
}
