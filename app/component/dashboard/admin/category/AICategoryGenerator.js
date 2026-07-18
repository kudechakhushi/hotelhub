// Calls your AI (runAi)
// Generates hotel room categories
// Lets user select one
// Sends selection back to parent

// 👉 It’s basically:
// AI → UI → User Selection → Parent Update
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    CircularProgress,
    Divider,
    Tooltip,
    IconButton,
} from "@mui/material";
// Chip → small selectable UI item
// Tooltip → hover info
// Stack → layout wrapper
import { runAi } from "@/ai/ai";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { styles, chipColors, animations } from "./AICategoryGeneratorstyles";

const AICategoryGenerator = ({ onSelectCategory, onAddCategory }) => {
    // onSelectCategory → send selected category to parent
    // onAddCategory → add category to main list
    const [loading, setLoading] = useState(false);
    const [generatedCategories, setGeneratedCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [generationCount, setGenerationCount] = useState(0);
    // Used in prompt to avoid repetition
    const [error, setError] = useState(null);

    const generateCategories = async () => {
        // Start loading + clear previous errors
        setLoading(true);
        setError(null);

        try {
            //             Quantity → 5
            // Domain → hotel room categories
            // Goal → appealing to modern travelers
            // You're trying to trick the AI into thinking each request is new so it avoids repeating results.
            // generationCount → how many times you've already generated categories
            // + 1 → next batch number
            //guide : This is where you're trying to shape the AI’s thinking.
            //req:  This is the most important part if you're parsing output in code.
            const prompt = `Generate 5 completely unique hotel room category names for batch ${generationCount + 1
                } that would appeal to modern travelers.
     
      Guidelines:
    
      1. Mix categories for different traveler types (business, families, couples, solo, luxury, budget)
      2. Vary by room size, view quality, and special amenities
      3. Use appealing modifiers (Premium, Deluxe, Executive, Cozy, Spacious)
      4. Include at least one innovative concept (like "Smart Rooms" or "Eco Suites")
      5. Never repeat categories from previous batches
      6. Ensure names are clear but distinctive
      
      Format requirements:
      - Comma-separated only
      - No numbering or bullets
      - Each category 2-4 words
      - Example format: "Panorama Luxury Suite, Urban Explorer Pod, Family Bunk Room"`;

            const response = await runAi(prompt);
            // Calls your backend

            console.log("response", response)
            let categories = response
                .split(",")
                .map((cat) => cat.trim())
                .filter((cat) => cat.length > 0);
                // .split(",")
                // → converts string into array
                // .map(trim)
                // → removes spaces
                // .filter
                // → removes empty values
            if (categories.length === 0) {
                throw new Error("No categories returned from AI");
            }


            console.log(" categories", categories)
            setGeneratedCategories(categories.slice(0, 5));
            // Ensures max 5 categories     
            setGenerationCount((prev) => prev + 1);
            // Next batch number
        } catch (error) {
            console.error("AI generation failed:", error);
            setError(
                error?.message?.includes("429")
                    ? "API quota exceeded. Enable billing in Google AI Studio or wait and try again."
                    : error?.message || "Failed to generate categories. Please try again."
            );
            setGeneratedCategories([]);
            // Clears UI on failure
        } finally {
            setLoading(false);
        }
    };





    const handleSelect = (category) => {
        setSelectedCategory(category)
        // Updates local state
        onSelectCategory(category)
        // Sends data to parent
    }


    const handleAdd = () => {
        if (selectedCategory) {
            onAddCategory(selectedCategory)
            // Adds to main system
            setSelectedCategory("")
        }
        // Sends selected category to parent list

    }

    // Reset UI
    const clearGenerated = () => {
        setGeneratedCategories([])
        setSelectedCategory("")
    }



    return (
        <Box sx={styles.container}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={styles.header}>
                        AI Category Generator
                    </Typography>
                    <Tooltip title="Generates fresh, unique categories each time">
                        <ShuffleIcon
                            fontSize="small"
                            sx={{
                                color: "#FD79A8",
                                animation: loading ? "spin 2s linear infinite" : "none",
                                ...animations.spin,
                            }}
                        />
                    </Tooltip>
                </Box>
                {generatedCategories.length > 0 && (
                    <IconButton
                        onClick={clearGenerated}
                        size="small"
                        sx={styles.closeButton}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <Button
                startIcon={!loading && <ShuffleIcon />}
                variant="contained"
                onClick={generateCategories}
                disabled={loading}
                fullWidth
                sx={styles.generateButton}
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                ) : (
                    "Generate New Categories"
                )}
            </Button>

            {error && (
                <Box sx={styles.errorBox}>
                    <Typography variant="body2" sx={styles.errorText}>
                        <CloseIcon fontSize="small" />
                        {error}
                    </Typography>
                </Box>
            )}

            {generatedCategories.length > 0 && (
                <>
                    <Divider sx={styles.divider} />

                    <Typography variant="subtitle1" sx={styles.suggestionsTitle}>
                        <span style={{ color: "#FD79A8" }}>✦</span> AI Suggestions (Select
                        one):
                    </Typography>

                    <Stack direction="row" sx={styles.chipsContainer}>
                        {generatedCategories.map((category, index) => (
                            <Chip
                                key={index}
                                label={category}
                                onClick={() => handleSelect(category)}
                                variant={selectedCategory === category ? "filled" : "outlined"}
                                sx={styles.chip(
                                    chipColors[index % chipColors.length],
                                    selectedCategory === category
                                )}
                            />
                        ))}
                    </Stack>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={handleAdd}
                            disabled={!selectedCategory}
                            sx={styles.addButton}
                            // Disabled until user selects something
                        >
                            Add to Categories
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default AICategoryGenerator;

// Step 1:

// User clicks:
// 👉 “Generate New Categories”

// ⚙️ Step 2:

// generateCategories() runs

// 🤖 Step 3:

// Prompt → runAi() → Gemini API

// 🌐 Step 4:

// AI returns text:

// "Luxury Suite, Budget Room, Eco Pod..."
// 🔄 Step 5:

// Converted to array:

// ["Luxury Suite", "Budget Room", ...]
// 🎯 Step 6:

// Displayed as chips

// 👆 Step 7:

// User clicks chip → selected

// ➕ Step 8:

// User clicks “Add to Categories”

// 📤 Step 9:

// Sent to parent via onAddCategory