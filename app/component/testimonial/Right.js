"use client";
import React from 'react';
import { Grid, Box, Card, CardMedia, CardContent, Typography, Badge, Rating, Container, Stack } from '@mui/material';
import { styled } from '@mui/system';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), { ssr: false });
const StyledCard = styled(Card)({
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease-in-out',
    },
    maxWidth: 954,

});

const SquareImage = styled(CardMedia)({
    borderRadius: '8px',
    width: '100%',
    height: '35vh',
    margin: '0 auto',
});

const PostCard = ({ post }) => {
    return (
        <StyledCard>
            <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid size={12}>
    <Stack direction="column" sx={{ alignItems: 'center' }}>
        <SquareImage
            component="img"
            image={post.imageUrl}
            alt={post.title}
        />
        <Typography variant="h6" component="div" sx={{ paddingTop: 2 }}>
            {post.title}
        </Typography>
    </Stack>
</Grid>
<Grid size={12}>
    <Stack direction="column" sx={{ alignItems: 'center' }}>
        <LocalLibraryIcon sx={{ color: 'red', marginRight: 1 }} size="large" />
        <Typography variant="body2" color="text.secondary" sx={{ paddingTop: 2 }}>
            {post.location}
        </Typography>
    </Stack>
</Grid>
             
            </Grid>
        </StyledCard>
    );
};


const dummyPosts = [
    {
        title: "Beautiful Mountain View",

      
        location: "his his setup should give you a layout where each slide setup should give you a layout where each slide ",
        imageUrl: "/images/hotel2.jpg",
    },
    {
        title: "Sunny Beach",

     
        location: "hishis setup should give you a layout where each slide  setup should give you a layout where each slide ",
        imageUrl: "/images/hotel2.jpg",
    },
    {
        title: "City Lights",

      
        location: "hishis setup should give you a layout where each slide  setup should give you a layout where each slide ",
        imageUrl: "/images/hotel16.jpg",
    },
    {
        title: "Serene Forest",

      
        location: "his  his setup should give you a layout where each slide   setup should give you a layout where each slide ",
        imageUrl: "/images/hotel3.jpg",
    },
    {
        title: "Desert Adventure",

    
        location: "Shis his setup should give you a layout where each slide setup should give you a layout where each slide ",
        imageUrl: "/images/hotel16.jpg",
    },
];

export default function ClientSaid() {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
      

          


            <Slider {...settings}>
                {dummyPosts.map((post, index) => (
                    <Box key={index} sx={{ padding: 1 }}>
                        <PostCard post={post} />
                    </Box>
                ))}
            </Slider>
      
    );
}