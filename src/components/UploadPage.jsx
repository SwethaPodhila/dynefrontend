import { useRef, useState } from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    LinearProgress,
    CircularProgress,
    Alert,
    Skeleton,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

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

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) startProcessing(f.name);
    };

    return (
        <Box maxWidth={760} mx="auto">
            <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>

                {/* Top Gradient */}
                <Box
                    sx={{
                        height: 6,
                        background:
                            "linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)",
                    }}
                />

                <CardContent sx={{ p: { xs: 3, md: 5 } }}>

                    {/* Header */}
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                        <CloudUploadIcon sx={{ mr: 1 }} />
                        Upload Your Dataset
                    </Typography>

                    <Typography color="text.secondary" mb={3}>
                        Drop a CSV or Excel file with your products and reviews — we’ll process it instantly.
                    </Typography>

                    {/* Drop Zone */}
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
                            border: `2px dashed ${dragOver ? "#6366f1" : "#c7d2fe"
                                }`,
                            background: dragOver ? "#eef2ff" : "#fafbff",
                            cursor: "pointer",
                            transition: "0.2s",
                        }}
                    >
                        <Box
                            sx={{
                                mx: "auto",
                                mb: 2,
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg,#6366f1,#ec4899)",
                            }}
                        >
                            <CloudUploadIcon sx={{ color: "#fff", fontSize: 36 }} />
                        </Box>

                        <Typography fontWeight="bold">
                            {dragOver
                                ? "Release to upload"
                                : "Click or drag your file here"}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Supports .csv, .xlsx, .xls — up to 10MB
                        </Typography>

                        <input
                            ref={inputRef}
                            type="file"
                            hidden
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFile}
                        />
                    </Box>

                    {/* File Info */}
                    {fileName && (
                        <Box
                            mt={3}
                            p={2}
                            borderRadius={2}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            sx={{ background: "#f5f3ff" }}
                        >
                            <DescriptionIcon color="primary" />

                            <Box flex={1}>
                                <Typography variant="body2" fontWeight={600}>
                                    {fileName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {loading
                                        ? "Processing…"
                                        : done
                                            ? "Ready"
                                            : "Selected"}
                                </Typography>
                            </Box>

                            {loading && <CircularProgress size={20} />}
                            {done && <CheckCircleIcon color="success" />}
                        </Box>
                    )}

                    {/* Progress */}
                    {loading && (
                        <Box mt={3}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 8, borderRadius: 5 }}
                            />

                            <Box mt={2}>
                                <Skeleton height={14} />
                                <Skeleton height={14} width="75%" />
                                <Skeleton height={14} width="50%" />
                            </Box>
                        </Box>
                    )}

                    {/* Success */}
                    {done && !loading && (
                        <Alert
                            severity="success"
                            sx={{ mt: 3, borderRadius: 2 }}
                        >
                            <strong>All set!</strong> Your file looks great. Connect a parser
                            or load sample data to explore analytics.
                        </Alert>
                    )}

                    {/* Footer */}
                    <Box
                        mt={4}
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={2}
                        alignItems="center"
                    >
                        <Box>
                            <Typography fontWeight={600}>
                                Just want to explore?
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Load sample dataset instantly
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={onLoadSample}
                            sx={{
                                px: 3,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                background:
                                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#5b5cf6,#7c3aed)",
                                },
                            }}
                        >
                            Load Sample Data
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
