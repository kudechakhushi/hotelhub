// components/XpointLogo.js
import { Box, Typography } from '@mui/material';
// Box → generic container (div with styling power)
// Typography → text component
import { styled, keyframes } from '@mui/system';
// styled → lets you create custom styled components
// keyframes → defines animations (CSS animations in JS)

// WHAT keyframes MEANS It defines an animation timeline
//  Think of it like:start → middle → end
// 0% At the startscale(1) = normal size
// // 50%At the middle element grows to 110% size
// 100% At the end element returns to normal size

const pulse = keyframes` 

  0% {
    transform: scale(1);
       }
   
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;
// format:horizontal-offset | vertical-offset | blur-radius | color
// So:0 0 → no shift (centered shadow)
// 5px → blur amount
// #fff → color     
// Why multiple shadows?You stacked 7 shadows:
//  This increases:brightness spread glow intensity
// 50% : Blur values increased:
// Before	Now
// 5px	10px
// 10px	20px
// 35px	70px
//  Meaning:glow spreads wider glow becomes stronger Color shift
// red values slightly change → adds variation gives “flicker” feeling
// 100% : Blur values decreased Returns close to starting values
const glow = keyframes`
  0% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px rgb(189, 22, 22), 0 0 20px #ff00ff, 0 0 25px #ff00ff, 0 0 30px #ff00ff, 0 0 35px #ff00ff;
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px rgb(201, 22, 15), 0 0 30px rgb(204, 8, 8), 0 0 40px #ff00ff, 0 0 50px #ff00ff, 0 0 60px #ff00ff, 0 0 70px #ff00ff;
  }
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px rgb(231, 66, 16), 0 0 20px #ff00ff, 0 0 25px #ff00ff, 0 0 30px #ff00ff, 0 0 35px #ff00ff;
  }
`;
// rotation animation 0% no rotation 50% Middle: full spin (1 complete rotation)
// 100% End: back to no rotation
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const styles = [
   
    {
        background: 'red',
        WebkitBackgroundClip: 'text',
//         WebkitBackgroundClip: 'text' → shows background only inside text
// WebkitTextFillColor: 'transparent' → makes text color invisible so background shows
        WebkitTextFillColor: 'transparent',
        fontSize: '2.3rem',
        fontStyle: 'italic',
        textShadow: '2px 2px 4px #000000',
        // textShadow → black shadow behind text res: Red-colored text with shadow + italic
    },
    {
        color: '#ff4d4d',
        fontSize: '2rem',
        textDecoration: 'underline',
        fontWeight: 'bolder',
        transform: 'skewX(-10deg)',
        // transform: 'skewX(-10deg)' → tilts text sideways Result: Bold, underlined, slanted text
    },
  {
    color: 'red',
    fontSize: '2.7rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px #000000',
    animation: `${rotate} 2s infinite`,
    // 2s infinite → runs every 2 seconds, forever Result: Big bold text that keeps rotating
  },
    {
        background: 'linear-gradient(to right, #30CFD0 0%, #330867 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2rem',
        letterSpacing: '5px',
        textShadow: '2px 2px 4px #000000',
        animation: `${pulse} 2s infinite`,
        // linear-gradient → gradient color
        // letterSpacing → space between letters
        // animation: pulse → zoom in/out effect
        // Result: Gradient text that pulses (grows/shrinks)
    },
     {
        background: 'linear-gradient(to right, #30CFD0 0%, #330867 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2rem',
        letterSpacing: '5px',
        textShadow: '2px 2px 4px #000000',
        animation: `${pulse} 2s infinite`,
     },
    
    {
        color: 'orange',
        fontSize: '2rem',
        textShadow: '2px 2px 4px #000000',
        transform: 'rotate(10deg)',
        // rotate(10deg) → rotates text slightly Result: Orange tilted text
    },
    {
        background: 'linear-gradient(to left, #f7ff00, red)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2rem',
        fontWeight: 'lighter',
        animation: `${glow} 1.5s infinite`,
        // animation: glow → glowing effect Result: Glowing gradient text
    },
    {
        color: '#990000',
        fontSize: '2rem',
        textDecoration: 'underline',
        fontWeight: 'bolder',
        transform: 'rotate(10deg)'
        // Result: Dark red, bold, underlined, slightly rotated

    },
];
// styled = a function used to style components
// Typography = a built-in text component (like <p>, <h1>)
//  So this means:“Take Typography and make a styled version of it”
// display: "flex"
// Turns the component into a flex container
// Allows alignment control (like horizontal/vertical positioning)
// 👉 alignItems: "center"
// Works only because of flex
// Vertically centers content inside the component
const StyledTypography = styled(Typography)({
  lineHeight: 1,
  // Controls spacing between lines of text
  display: "flex",
  alignItems: "center",
});

const XpointLogo = () => { 
    const logoText = 'Hotelhub';
    return (
       <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* // So all letters will be in one horizontal line
        // Loops through each letter char = current letter index = position (0,1,2...) */}
            {logoText.split('').map((char, index) => (
                <StyledTypography key={index} sx={styles[index]}>
                    {/* Applies a different style to each letter
                    {char}Displays the actual letter */}
                    {char}
                </StyledTypography>
            ))}
        </Box>
    );
};

export default XpointLogo;