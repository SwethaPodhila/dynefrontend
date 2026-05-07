import { useState } from "react";
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsightsIcon from "@mui/icons-material/Insights";

const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { key: "products", label: "Products", icon: <InventoryIcon /> },
    { key: "upload", label: "Upload", icon: <CloudUploadIcon /> },
];

const SIDEBAR_W = 260;

function Brand() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 3,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    background: "linear-gradient(135deg,#6366f1,#ec4899)",
                }}
            >
                <InsightsIcon />
            </Box>

            <Box>
                <Typography fontWeight="bold" color="#fff">
                    ReviewIQ
                </Typography>
                <Typography variant="caption" color="gray">
                    Analytics Suite
                </Typography>
            </Box>
        </Box>
    );
}

function SideNav({ page, onNavigate, onClose }) {
    return (
        <List sx={{ px: 2, py: 2 }}>
            {navItems.map((item) => {
                const active = page === item.key;

                return (
                    <ListItemButton
                        key={item.key}
                        onClick={() => {
                            onNavigate(item.key);
                            onClose?.();
                        }}
                        sx={{
                            mb: 1,
                            borderRadius: 2,
                            color: active ? "#fff" : "#cbd5e1",
                            background: active
                                ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                : "transparent",
                            "&:hover": {
                                background: active
                                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                    : "rgba(255,255,255,0.06)",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                );
            })}
        </List>
    );
}

function PageHeader({ page }) {
    const titles = {
        dashboard: {
            title: "Dashboard Overview",
            sub: "Track product performance and review insights",
        },
        products: {
            title: "Product Catalog",
            sub: "Browse and filter products",
        },
        upload: {
            title: "Upload Dataset",
            sub: "Import your data",
        },
    };

    const t = titles[page] || { title: page, sub: "" };

    return (
        <Box mb={3}>
            <Typography variant="h5" fontWeight="bold">
                {t.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {t.sub}
            </Typography>
        </Box>
    );
}

export default function Layout({ page, onNavigate, children }) {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>

            {/* Desktop Sidebar */}
            <Box
                sx={{
                    width: SIDEBAR_W,
                    display: { xs: "none", lg: "flex" },
                    flexDirection: "column",
                    position: "fixed",
                    height: "100%",
                    background: "linear-gradient(180deg,#0f172a,#1e1b4b)",
                }}
            >
                <Brand />
                <SideNav page={page} onNavigate={onNavigate} />

                <Box sx={{ mt: "auto", p: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.05)",
                            color: "#cbd5e1",
                            fontSize: 13,
                        }}
                    >
                        ⭐ Pro Insights enabled
                    </Box>
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: { lg: "none" },
                    "& .MuiDrawer-paper": {
                        width: SIDEBAR_W,
                        background: "linear-gradient(180deg,#0f172a,#1e1b4b)",
                    },
                }}
            >
                <Brand />
                <SideNav
                    page={page}
                    onNavigate={onNavigate}
                    onClose={() => setOpen(false)}
                />
            </Drawer>

            {/* Main Section */}
            <Box sx={{ flexGrow: 1, ml: { lg: `${SIDEBAR_W}px` } }}>

                {/* Mobile AppBar */}
                <AppBar
                    position="sticky"
                    elevation={1}
                    sx={{
                        display: { lg: "none" },
                        background: "#fff",
                        color: "#1e1b4b",
                    }}
                >
                    <Toolbar>
                        <IconButton onClick={() => setOpen(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Typography fontWeight="bold" ml={1}>
                            ReviewIQ
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box sx={{ p: { xs: 2, lg: 4 } }}>
                    <PageHeader page={page} />
                    {children}
                </Box>
            </Box>
        </Box>
    );
}