"use client";
 
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Container,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import StyleIcon from "@mui/icons-material/Style";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DevicesIcon from "@mui/icons-material/Devices";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
 
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});
 
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
 
const INK = "#20242C";
const PARCHMENT = "#EDE8DA";
const CARDSTOCK = "#FBF7EE";
const MARKER = "#FFC933";
const PEN_TEAL = "#1E6E64";
 
export const theme = createTheme({
  palette: {
    primary: { main: INK },
    secondary: { main: PEN_TEAL },
    background: { default: PARCHMENT, paper: CARDSTOCK },
    text: { primary: INK, secondary: "#54514A" },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: "var(--font-body)",
    h1: { fontFamily: "var(--font-heading)", fontWeight: 700 },
    h2: { fontFamily: "var(--font-heading)", fontWeight: 700, color: INK },
    h3: { fontFamily: "var(--font-heading)", fontWeight: 700, color: INK },
    h4: { fontFamily: "var(--font-heading)", fontWeight: 700, color: INK },
    h5: { fontFamily: "var(--font-heading)", fontWeight: 500, color: INK },
    h6: { fontFamily: "var(--font-heading)", fontWeight: 600, color: INK },
    button: { textTransform: "none", fontWeight: 600 },
  },
});

const Highlight = ({ children }) => (
  <Box
    component="span"
    sx={{
      backgroundImage: `linear-gradient(180deg, transparent 62%, ${MARKER} 62%)`,
      backgroundRepeat: "no-repeat",
      paddingX: "3px",
    }}
  >
    {children}
  </Box>
);

const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);
 
  const faceStyles = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    borderRadius: 3,
    border: `1px solid rgba(32,36,44,0.15)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    px: 4,
    py: 3,
  };
 
  return (
    <Box sx={{ perspective: "1200px", width: "100%", maxWidth: 360, mx: "auto" }}>
      <Box
        component="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label="Flip example flashcard"
        sx={{
          position: "relative",
          width: "100%",
          height: 220,
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          "&:focus-visible": {
            outline: `3px solid ${PEN_TEAL}`,
            outlineOffset: 4,
          },
        }}
      >
        <Box sx={{ ...faceStyles, backgroundColor: CARDSTOCK, boxShadow: "0 10px 24px rgba(32,36,44,0.14)" }}>
          <Typography variant="caption" sx={{ color: PEN_TEAL, fontFamily: "var(--font-heading)", letterSpacing: "0.04em", mb: 1 }}>
            Q
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            What powers a cell?
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
            Tap to flip
          </Typography>
        </Box>
        <Box
          sx={{
            ...faceStyles,
            backgroundColor: INK,
            color: PARCHMENT,
            transform: "rotateY(180deg)",
            boxShadow: "0 10px 24px rgba(32,36,44,0.25)",
          }}
        >
          <Typography variant="caption" sx={{ color: MARKER, fontFamily: "var(--font-heading)", letterSpacing: "0.04em", mb: 1 }}>
            A
          </Typography>
          <Typography variant="h6" sx={{ color: "rgb(247, 247, 247)", fontWeight: 600 }}>
            The mitochondria
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(237,232,218,0.7)", mt: 2 }}>
            Generated in under a second
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
 
const HomePage = () => {
  const features = [
    {
      icon: <EditNoteIcon fontSize="large" sx={{ color: PEN_TEAL }} />,
      title: "Paste in your notes",
      description:
        "Drop in a paragraph, a chapter, or a full set of lecture notes. No formatting required.",
      rotate: -1.5,
    },
    {
      icon: <AutoAwesomeIcon fontSize="large" sx={{ color: PEN_TEAL }} />,
      title: "AI writes the cards",
      description:
        "Gemini reads your text and turns it into clear question-and-answer pairs, ready to study.",
      rotate: 0.5,
    },
    {
      icon: <DevicesIcon fontSize="large" sx={{ color: PEN_TEAL }} />,
      title: "Study on any device",
      description:
        "Your decks sync automatically, so you can review on your phone between classes or at your desk.",
      rotate: 1.5,
    },
  ];
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={`${spaceGrotesk.variable} ${plexSans.variable}`} sx={{ backgroundColor: PARCHMENT }}>
        {/* Header and Navigation */}
        <AppBar position="static" elevation={0} sx={{ backgroundColor: PARCHMENT, borderBottom: `1px solid rgba(32,36,44,0.12)` }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <StyleIcon sx={{ mr: 1, color: INK, transform: "rotate(-8deg)" }} />
              <Typography
                variant="h6"
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: INK,
                  textDecoration: "none",
                }}
              >
                Flash AI
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <SignedOut>
                <Button color="inherit" href="/sign-in" sx={{ color: INK }}>
                  Log in
                </Button>
                <Button
                  href="/sign-up"
                  variant="outlined"
                  sx={{
                    ml: 2,
                    color: INK,
                    borderColor: INK,
                    "&:hover": {
                      backgroundColor: "rgba(32,36,44,0.05)",
                      borderColor: INK,
                    },
                  }}
                >
                  Sign up
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </Container>
        </AppBar>
 
        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontSize: { xs: "2.4rem", md: "3.2rem" }, lineHeight: 1.15, mb: 3 }}>
                Turn your notes into <Highlight>flashcards</Highlight> in seconds
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, color: "text.secondary", mb: 4, maxWidth: 480 }}>
                Paste in what you&apos;re studying and Flash AI writes a full deck of question-and-answer
                cards for you, powered by Gemini.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="/generate"
                sx={{
                  backgroundColor: MARKER,
                  color: INK,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.05rem",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#E6B62E", boxShadow: "none" },
                }}
              >
                Generate your first deck
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <FlipCard />
            </Grid>
          </Grid>
        </Container>
 
        {/* Perforated tear line between hero and features */}
        <Box sx={{ borderTop: `2px dashed rgba(32,36,44,0.2)` }} />
 
        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h4" sx={{ mb: 6, maxWidth: 520 }}>
            Everything happens in three steps
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    position: "relative",
                    p: 4,
                    height: "100%",
                    backgroundColor: CARDSTOCK,
                    border: "1px solid rgba(32,36,44,0.15)",
                    borderRadius: 2,
                    transform: `rotate(${feature.rotate}deg)`,
                    transition: "transform 0.25s ease",
                    "&:hover": { transform: `rotate(0deg) translateY(-4px)` },
                    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: PEN_TEAL,
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
 
        {/* Pricing Section, styled like ruled notebook paper */}
        <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#E6E0D0" }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 6, textAlign: "center" }}>
              Pricing
            </Typography>
            <Grid container spacing={5} justifyContent="center">
              {[
                {
                  name: "Basic",
                  price: "$0/month",
                  features: ["Unlimited flashcards", "Access on all devices", "Core AI generation"],
                  cta: "Start free",
                  filled: false,
                },
                {
                  name: "Pro",
                  price: "$10/month",
                  features: [
                    "Everything in Basic",
                    "Longer documents per deck",
                    "Priority generation speed",
                    "Early access to new features",
                  ],
                  cta: "Go Pro",
                  filled: true,
                },
              ].map((plan, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    elevation={0}
                    sx={{
                      position: "relative",
                      p: 4,
                      pl: 5,
                      borderRadius: 1,
                      backgroundColor: CARDSTOCK,
                      backgroundImage: `repeating-linear-gradient(rgba(32,36,44,0.08) 0px, rgba(32,36,44,0.08) 1px, transparent 1px, transparent 34px)`,
                      backgroundPosition: "0 60px",
                      border: "1px solid rgba(32,36,44,0.15)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 28,
                        width: "1px",
                        backgroundColor: "rgba(196,64,64,0.45)",
                      },
                    }}
                  >
                    <CardContent sx={{ position: "relative" }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" sx={{ mb: 3 }}>
                        {plan.price}
                      </Typography>
                      <Box component="ul" sx={{ pl: 2.5, mb: 4 }}>
                        {plan.features.map((feat, i) => (
                          <Typography component="li" key={i} sx={{ mb: 1, color: "text.secondary" }}>
                            {feat}
                          </Typography>
                        ))}
                      </Box>
                      <Button
                        variant={plan.filled ? "contained" : "outlined"}
                        fullWidth
                        sx={
                          plan.filled
                            ? {
                                backgroundColor: MARKER,
                                color: INK,
                                boxShadow: "none",
                                "&:hover": { backgroundColor: "#E6B62E", boxShadow: "none" },
                              }
                            : { color: INK, borderColor: INK, "&:hover": { borderColor: INK, backgroundColor: "rgba(32,36,44,0.05)" } }
                        }
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
 
export default HomePage;