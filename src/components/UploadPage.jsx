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

    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const startProcessing = (name) => {
        setFileName(name);
        setLoading(false);
        setDone(false);
        setProgress(0);
        setResult(null);
        setErrorMsg("");
    };

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (f) startProcessing(f.name);
    };

    const handleSubmit = async () => {
        if (!fileName) return;

        try {
            setLoading(true);
            setProgress(20);
            setErrorMsg("");
            setResult(null);

            const formData = new FormData();
            formData.append("file", inputRef.current.files[0]);

            const res = await fetch("dynebackend-production.up.railway.app/products/upload", {
                method: "POST",
                body: formData,
            });

            setProgress(60);

            const data = await res.json();

            setProgress(90);

            if (!res.ok) {
                throw new Error(data?.msg || "Upload failed");
            }

            setResult(data);
            setDone(true);
            setProgress(100);

        } catch (err) {
            setErrorMsg(err.message || "Something went wrong ❌");
            setDone(false);

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
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "60% 40%" }, gap: 3 }}>

                {/* ================= LEFT SIDE ================= */}
                <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                    <Box sx={{ height: 6, background: "linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)" }} />

                    <CardContent sx={{ p: 4 }}>

                        <Typography variant="h5" fontWeight={800}>
                            <CloudUploadIcon sx={{ mr: 1 }} />
                            Upload Dataset
                        </Typography>

                        <Typography color="text.secondary" mt={1} mb={3}>
                            Upload CSV / Excel file for processing
                        </Typography>

                        {/* DROP AREA */}
                        <Box
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            sx={{
                                textAlign: "center",
                                p: 5,
                                borderRadius: 3,
                                border: `2px dashed ${dragOver ? "#6366f1" : "#cbd5e1"}`,
                                background: dragOver ? "#eef2ff" : "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 60, color: "#6366f1" }} />

                            <Typography fontWeight={700} mt={1}>
                                {dragOver ? "Drop file here" : "Click or drag file"}
                            </Typography>

                            <Typography variant="caption">
                                .csv, .xlsx, .xls
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
                            <Box mt={3} p={2} display="flex" gap={2}
                                sx={{ background: "#f1f5f9", borderRadius: 2 }}>

                                <DescriptionIcon />

                                <Box flex={1}>
                                    <Typography fontWeight={600}>{fileName}</Typography>
                                    <Typography variant="caption">
                                        {loading ? "Uploading..." : done ? "Completed" : "Ready"}
                                    </Typography>
                                </Box>

                                {loading && <CircularProgress size={20} />}
                                {done && <CheckCircleIcon color="success" />}
                            </Box>
                        )}

                        {/* PROGRESS */}
                        {loading && (
                            <Box mt={3}>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                        )}

                        {/* ACTIONS */}
                        <Box mt={4} display="flex" justifyContent="space-between">

                            <Button
                                variant="contained"
                                startIcon={<AutoAwesomeIcon />}
                                onClick={onLoadSample}
                            >
                                Load Sample
                            </Button>

                            <Button
                                variant="contained"
                                disabled={!fileName || loading}
                                onClick={handleSubmit}
                                sx={{ background: "#10b981" }}
                            >
                                Submit
                            </Button>
                        </Box>

                        {/* ERROR */}
                        {errorMsg && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMsg}
                            </Alert>
                        )}

                        {/* RESULT SUMMARY */}
                        {result && (
                            <Box mt={3}>

                                <Alert severity="success">
                                    {result.message?.insertedMsg}
                                </Alert>

                                <Alert severity="info" sx={{ mt: 1 }}>
                                    {result.message?.duplicateMsg}
                                </Alert>

                                <Alert severity="warning" sx={{ mt: 1 }}>
                                    {result.message?.errorMsg}
                                </Alert>

                                <Box display="flex" gap={2} mt={2} flexWrap="wrap">

                                    <Card sx={{ p: 2, flex: 1 }}>
                                        <Typography fontWeight={600}>Inserted</Typography>
                                        <Typography fontSize={22} color="green">
                                            {result.summary.inserted}
                                        </Typography>
                                    </Card>

                                    <Card sx={{ p: 2, flex: 1 }}>
                                        <Typography fontWeight={600}>Duplicates</Typography>
                                        <Typography fontSize={22} color="orange">
                                            {result.summary.duplicates}
                                        </Typography>
                                    </Card>

                                    <Card sx={{ p: 2, flex: 1 }}>
                                        <Typography fontWeight={600}>Errors</Typography>
                                        <Typography fontSize={22} color="red">
                                            {result.summary.errors}
                                        </Typography>
                                    </Card>

                                </Box>
                            </Box>
                        )}

                        {/* DUPLICATES LIST */}
                        {result?.duplicateDetails?.length > 0 && (
                            <Box mt={3}>
                                <Typography fontWeight={700} color="orange">
                                    ⚠️ Duplicate Products
                                </Typography>

                                <Box sx={{
                                    maxHeight: 200,
                                    overflow: "auto",
                                    p: 2,
                                    background: "#fff7ed",
                                    borderRadius: 2,
                                    mt: 1
                                }}>
                                    {result.duplicateDetails.map((item, i) => (
                                        <Typography key={i} variant="body2">
                                            {item}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {result?.errorDetails?.length > 0 && (
                            <Box mt={3}>
                                <Typography fontWeight={700} color="red">
                                    ❌ Error Records
                                </Typography>

                                <Box sx={{
                                    maxHeight: 200,
                                    overflow: "auto",
                                    p: 2,
                                    background: "#fef2f2",
                                    borderRadius: 2,
                                    mt: 1
                                }}>
                                    {result.errorDetails.map((item, i) => (
                                        <Typography key={i} variant="body2">
                                            {item}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        )}

                    </CardContent>
                </Card>

                {/* ================= RIGHT SIDE ================= */}
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