import { useRef, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
    CircularProgress,
    Alert,
    Skeleton,
    Divider,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function UploadPage({ onLoadSample }) {
    const inputRef = useRef(null);

    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const startProcessing = (name) => {
        setFileName(name);
        setLoading(true);
        setDone(false);
        setProgress(0);

        let p = 0;
        const interval = setInterval(() => {
            p += 12;
            setProgress(Math.min(100, p));

            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setLoading(false);
                    setDone(true);
                }, 300);
            }
        }, 180);
    };

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (f) startProcessing(f.name);
    };

    const handleSubmit = async () => {
        if (!fileName) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", inputRef.current.files[0]);

            const res = await fetch("http://localhost:5000/products/upload", {
                method: "POST",
                body: formData,
            });

            let data;

            try {
                data = await res.json();
            } catch (e) {
                throw new Error("Invalid server response");
            }

            console.log("📩 Backend Response:", data);

            if (!res.ok) {
                throw new Error(data?.message || "Upload failed");
            }

            setDone(true);
            alert("File uploaded successfully ✅");

        } catch (err) {
            console.log("❌ FRONTEND ERROR:", err.message);
            alert(err.message || "Something went wrong ❌");

        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) startProcessing(f.name);
    };

    const requiredColumns = [
        "product_id",
        "product_name",
        "category",
        "discounted_price",
        "actual_price",
        "discount_percentage",
        "rating",
        "rating_count",
        "about_product",
        "user_name",
        "review_title",
        "review_content",
    ];

    return (
        <Box
            sx={{
                maxWidth: 1200,
                mx: "auto",
                p: 2,
            }}
        >
            {/* GRID LAYOUT 60/40 */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "60% 40%" },
                    gap: 3,
                }}
            >

                {/* ================= LEFT SIDE (UPLOAD - 60%) ================= */}
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <Box
                        sx={{
                            height: 6,
                            background:
                                "linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)",
                        }}
                    />

                    <CardContent sx={{ p: 4 }}>

                        <Typography variant="h5" fontWeight={800}>
                            <CloudUploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                            Upload Dataset
                        </Typography>

                        <Typography color="text.secondary" mt={1} mb={3}>
                            Upload CSV/Excel file for instant analytics processing
                        </Typography>

                        {/* DROP AREA */}
                        <Box
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            sx={{
                                textAlign: "center",
                                p: 5,
                                borderRadius: 3,
                                border: `2px dashed ${dragOver ? "#6366f1" : "#cbd5e1"}`,
                                background: dragOver ? "#eef2ff" : "#fff",
                                cursor: "pointer",
                                transition: "0.2s",
                                "&:hover": { background: "#f8fafc" },
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 60, color: "#6366f1" }} />

                            <Typography fontWeight={700} mt={1}>
                                {dragOver ? "Drop file here" : "Click or drag file to upload"}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                .csv, .xlsx, .xls (Max 10MB)
                            </Typography>

                            <input
                                ref={inputRef}
                                type="file"
                                hidden
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFile}
                            />
                        </Box>

                        {/* FILE INFO */}
                        {fileName && (
                            <Box
                                mt={3}
                                p={2}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                sx={{
                                    background: "#f1f5f9",
                                    borderRadius: 2,
                                }}
                            >
                                <DescriptionIcon />

                                <Box flex={1}>
                                    <Typography fontWeight={600}>
                                        {fileName}
                                    </Typography>
                                    <Typography variant="caption">
                                        {loading ? "Processing..." : done ? "Completed" : "Selected"}
                                    </Typography>
                                </Box>

                                {loading && <CircularProgress size={20} />}
                                {done && <CheckCircleIcon color="success" />}
                            </Box>
                        )}

                        {/* PROGRESS */}
                        {loading && (
                            <Box mt={3}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ height: 8, borderRadius: 5 }}
                                />
                                <Box mt={2}>
                                    <Skeleton height={12} />
                                    <Skeleton height={12} width="70%" />
                                </Box>
                            </Box>
                        )}

                        {/* SUCCESS */}
                        {done && (
                            <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                                File uploaded successfully
                            </Alert>
                        )}

                        {/* SAMPLE BUTTON */}
                        {/* ACTION BUTTONS */}
                        <Box
                            mt={4}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            flexWrap="wrap"
                        >
                            <Button
                                variant="contained"
                                startIcon={<AutoAwesomeIcon />}
                                onClick={onLoadSample}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                }}
                            >
                                Load Sample Data
                            </Button>

                            <Button
                                variant="contained"
                                disabled={!fileName || loading}
                                onClick={handleSubmit}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background: "#10b981",
                                    "&:hover": { background: "#059669" },
                                }}
                            >
                                Submit File
                            </Button>
                        </Box>

                    </CardContent>
                </Card>

                {/* ================= RIGHT SIDE (INSTRUCTIONS - 40%) ================= */}
                <Card
                    sx={{
                        borderRadius: 4,
                        background: "#f8fafc",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>

                        {/* Header */}
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <InfoOutlinedIcon sx={{ color: "#6366f1" }} />
                            <Typography fontWeight={800}>
                                File Guidelines
                            </Typography>
                        </Box>

                        {/* Instructions */}
                        <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                            Instructions
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, lineHeight: 1.6 }}
                        >
                            Upload a properly structured CSV/Excel file containing product reviews.
                            Make sure all required fields are included and correctly named.
                        </Typography>

                        {/* Columns Section */}
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            Required Columns
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                background: "#ffffff",
                                border: "1px solid #e5e7eb",
                                maxHeight: 280,
                                overflowY: "auto",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: "monospace",
                                    fontSize: 13,
                                    lineHeight: 1.8,
                                    color: "#374151",
                                    wordBreak: "break-word",
                                }}
                            >
                                {requiredColumns.join("  •  ")}
                            </Typography>
                        </Box>

                        {/* Footer Note */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                background: "#eef2ff",
                                border: "1px solid #e0e7ff",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{ color: "#4f46e5", fontWeight: 500 }}
                            >
                                ⚠️ Column names must match exactly. Missing or extra fields may cause errors.
                            </Typography>
                        </Box>

                    </CardContent>
                </Card>

            </Box>
        </Box>
    );
}
