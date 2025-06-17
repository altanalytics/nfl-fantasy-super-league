import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';


interface HeroComponentProps {
  heroText: string;
  heroImage: string;
  textGray?: string;
  textOutline?: string;
}

export default function HeroComponent({
  heroText,
  heroImage,
  textGray = "no",
  textOutline = "no",
}: HeroComponentProps) {
    const StyledBox = styled('div')(({ theme }) => ({
        position: 'relative',
        width: '100%',
        height: '50vh', // Shrink the image to 50% of the viewport height
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }));

    const DefaultTextOverlay = styled('div')(() => ({
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        color: '#fff',
        padding: '0 5%', // horizontal padding
        maxWidth: '100%',
        }));

    const GrayTextOverlay = styled('div')(() => ({
        position: 'absolute',
        top: '50%',
        width: '100%',
        transform: 'translateY(-50%)', // Center text vertically
        color: '#fff',
        padding: '1rem', // Add some padding inside the box
        textAlign: 'center',
        backgroundColor: 'rgba(150, 150, 150, 0.5)', // Light gray with transparency
    }));

    const TextOverlay = textGray.toLowerCase() === "yes" ? GrayTextOverlay : DefaultTextOverlay;

    return (
        <Box id="hero-section" sx={{ width: '100%' }}>
            <StyledBox>
                <TextOverlay>
                    <Typography
                        variant="h1"
                        
                        sx={{
                            fontSize: 'clamp(3.5rem, 10vw, 3.5rem)',
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            textShadow: textOutline.toLowerCase() === "yes" 
                                ? '1px 1px 2px black, -1px -1px 2px black' 
                                : 'none', // Add text outline if enabled
                        }}
                    >
                        {heroText}
                    </Typography>
                </TextOverlay>
            </StyledBox>
        </Box>
    );
}
