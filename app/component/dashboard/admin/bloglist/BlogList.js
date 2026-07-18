import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// useDispatch() → send actions
// useSelector() → read data from store
import Link from "next/link";
// Next.js navigation
import {
  CircularProgress,
  Alert,
  Box,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import { Edit, Delete, Favorite, Visibility } from "@mui/icons-material";

import { fetchBlogPosts, deleteBlogPost } from "@/slice/blogSlice";
// Async Redux actions
import {
  StyledContainer,
  StyledCard,
  StyledCardMedia,
  StyledCardContent,
  StyledTitle,
  StyledChipContainer,
  StyledActionBox,
  StyledReadMore,
  StyledIconButton,
} from "./BlogStyles";
import EditBlogModal from './EditBlogModal';

const BlogPostsList = () => {
  const { list: blogs, loading } = useSelector((state) => state.blogs);
  // useSelector reads data from the Redux store.
  // state.blogs → your blog slice
  // list → renamed to blogs
  // loading → boolean for API status
  const dispatch = useDispatch();
  // Gives you access to Redux actions
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  // Stores the blog being edited
  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, []);
//   Runs once when component loads
// calls API via Reduxfills blogs in store

  const handleDelete = async (id) => {
    if (window.confirm("are you sure  you want  to delete  this post ?")) {
      // Native browser confirmation popup
      try {
        await dispatch(deleteBlogPost(id)).unwrap();
        // Deletes the post via Redux .unwrap() → makes errors throw allows catch to work
      } catch (error) {
        setError(error.message || "failed to delete post");
      }
    }
  };
  // Triggered when user clicks edit
  const handleEditClick = (post) => {
    setSelectedPost(post);
    // Stores clicked blog
    setEditModalOpen(true);
    // Opens modal
      
  };

  const handleCloseModal = () => {

    setEditModalOpen(false);
    // Closes modal
    setSelectedPost(null);
    // Clears selected blog
  };
 
  // If data is loading: show spinner
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
      <CircularProgress />
    </Box>
    );
  }

  // If error exists:show alert
  if (error) {
    return (
      <StyledContainer maxWidth="md">
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <>
      <StyledContainer maxWidth="lg">
      <Grid container spacing={3}>
  {blogs.map((post) => (
    // Iterates over blog list
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post._id}>
              <StyledCard>
                <Link href={`/blog/${post.slug}`} passHref>
                {/* Click image → navigate to blog page */}
                  <StyledCardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                  />
                </Link>

                <StyledCardContent>
                  <Link href="#" passHref>
                    <StyledTitle gutterBottom variant="h5" component="div">
                      {post.title}
                    </StyledTitle>
                  </Link>

                  <Typography variant="body2" color="text.secondary">
                    {post.description.length > 100
                    // “Is the description longer than 100 characters?”
                      ? `${post.description.substring(0, 100)}...`
                      // takes first 100 characters ... → adds ellipsis
                      : post.description}
                      {/* Show full text as-is */}
                  </Typography>

                  <StyledActionBox>
                    <Link href="#" passHref>
                      <StyledReadMore component="div" color="primary">
                        Read More
                      </StyledReadMore>
                    </Link>

                    <Box>
                      <StyledIconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(post)}
                        color="primary"
                      >
                        <Edit />
                      </StyledIconButton>
                      <StyledIconButton
                        aria-label="delete"
                        onClick={() => handleDelete(post._id)}
                        color="error"
                      >
                        <Delete />
                      </StyledIconButton>
                    </Box>
                  </StyledActionBox>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>

      <EditBlogModal
        open={editModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      /> 
    </>
  );
};

export default BlogPostsList;

// Component loads
// Fetch blogs
// Show loading → then blogs
// User:
// clicks delete → removes post
// clicks edit → opens modal