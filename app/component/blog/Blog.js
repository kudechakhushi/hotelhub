// components/JournalAtGlance.js
// this is for client sitee dashboard to view on dashboard page include it in page.js file
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Used to navigate between pages programmatically
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Box,
} from "@mui/material";
import { Favorite, Visibility } from "@mui/icons-material";

const Blogs = () => {
    const router = useRouter();
    // Used to navigate when user clicks a blog
    const [articles, setArticles] = useState([]);
    // Stores fetched blog data
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`/api/blogs`);
                // Calls your backend API
                if (!response.ok) {
                    throw new Error("Failed to fetch articles");
                }

                const data = await response.json();
                // Converts response → JSON
                setArticles(data);
                // Stores blogs in state
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);
    // Runs only once

    const handleArticleClick = (slug) => {
        router.push(`/blogs?slug=${slug}`);
        // Redirects to blog page with query param
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Container maxWidth="xl">
            <Box sx={{ padding: "2rem", textAlign: "center" }}>
                <Typography variant="overline" sx={{ color: "#FF6F61" }}>
                    TESTIMONIAL
                </Typography>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", marginBottom: "2rem" }}
                >
                    Our Latest Testimonials and What Our Client Says
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Grid container spacing={3}>
                    {articles.map((article) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article._id}>
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-2px)",
                                        transition: "all 0.3s ease",
                                    },
                                }}
                                onClick={() => handleArticleClick(article.slug)}
                            >
                                <Box
                                    sx={{
                                        height: 200,
                                        backgroundImage: `url(${article.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(article.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}{" "}
                                    </Typography>
                                    {/* Views + Likes icons */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Visibility fontSize="small" color="action" />
                                            <Typography variant="body2">{article.view ?? 0}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Favorite fontSize="small" color="error" />
                                            <Typography variant="body2">{article.likes ?? 0}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {article.description.length > 100
                                            ? `${article.description.substring(0, 100)}...`
                                            : article.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: "red",
                                            borderColor: "red",
                                            marginTop: 2,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleArticleClick(article.slug);
                                        }}
                                    >
                                        Read More
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Blogs;