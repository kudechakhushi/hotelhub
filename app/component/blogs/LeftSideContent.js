import { Box, Grid, Typography, IconButton } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const LeftSideContent = ({

  title,
  description,
  image,
  views,
  postedDate,
  //             title → blog title
  // description → blog content
  // image → blog image
  // views → number of views (you’re not using this properly)
  // postedDate → date when blog was posted

}) => {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Box
          component="img"
          src={image}
          alt="Main"
          sx={{
            width: 800,
            height: 400,
            marginRight: '10px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
      </Grid>

      <Grid size={12} container spacing={2}>
        <Grid style={{ display: 'flex' }}>
          <IconButton aria-label="Verified">
            <VerifiedUserIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>Verified</Typography>
        </Grid>
        <Grid style={{ display: 'flex' }}>
          <IconButton aria-label="Add to Favorites">
            <FavoriteIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>Add to Favorites</Typography>
        </Grid>
        <Grid style={{ display: 'flex' }}>
          <IconButton aria-label="Views">
            <VisibilityIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>100 views</Typography>
        </Grid>
        <Grid style={{ display: 'flex' }}>
          <Typography variant="body2" sx={{ marginTop: 1 }}>open</Typography>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      <Grid size={12}>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line', // Preserves line breaks
            lineHeight: 1.6, // Better readability
            mb: 3, // Bottom margin
            textAlign: 'justify', // Clean alignment
          }}
        >
          {description}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body1">Login to leave a comment.</Typography>
      </Grid>
    </Grid>
  );
};