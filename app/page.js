"use client";

import React from "react";
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
import Layout from "./api/components/layout";
import BoltIcon from "@mui/icons-material/Bolt";
import { Kanit } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#701111",
    },
    secondary: {
      main: "#d66767",
    },
    background: {
      paper: "#f4d9d0",
    },
  },
  typography: {
    fontFamily: "Kanit",
    h5: {
      color: "#A74766",
    },
    h4: {
      color: "#921a1a",
    },
    h2: {
      color: "#e0d6d5",
    },
  },
});



const HomePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        {/* Header and Navigation
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar> */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ backgroundColor: "#570e0e" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <BoltIcon sx={{ mr: 1, color: "#FFD700" }} />
              <Typography
                variant="h6"
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  letterSpacing: ".15rem",
                  color: "#FFD700",
                  textDecoration: "none",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Flash AI
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <SignedOut>
                <Button
                  color="inherit"
                  href="/sign-in"
                  sx={{ color: "#FFD700" }}
                >
                  Login
                </Button>
                <Button
                  href="/sign-up"
                  variant="outlined"
                  sx={{
                    ml: 2,
                    color: "#FFD700",
                    borderColor: "#FFD700",
                    "&:hover": {
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      borderColor: "#FFC107",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: "#570e0e",
            py: { xs: 10, md: 16 },
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Container>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <BoltIcon sx={{ fontSize: 60, color: "#FFD700" }} />
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              >
                Flash AI
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 4, color: "#f5f5f5" }}>
              Generate Flashcards using your own prompts with the help of AI.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#FFD700",
                color: "#570e0e",
                fontWeight: 600,
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#e6c200",
                },
              }}
              href="/generate"
            >
              Get Started
            </Button>
          </Container>
        </Box>
        {/* Curved Transition */}
        <Box
          sx={{
            height: 36,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: "36px",
            borderTopRightRadius: "36px",
            mt: -4,
            boxShadow: "0 -8px 12px rgba(87,14,14,0.15)",
          }}
        />

        {/* Features Section */}
        <Container sx={{ py: 8 }}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
          >
            Features
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {[
              {
                icon: (
                  <KeyboardIcon fontSize="large" sx={{ color: "#c75b7a" }} />
                ),
                title: "Easy Text Input",
                description:
                  "Simply input your text and let our software do the rest. Creating flashcards has never been easier.",
              },
              {
                icon: (
                  <AutoAwesomeIcon fontSize="large" sx={{ color: "#c75b7a" }} />
                ),
                title: "Smart Flashcards",
                description:
                  "Our AI intelligently breaks down your text into concise flashcards, perfect for studying.",
              },
              {
                icon: (
                  <DevicesOtherIcon
                    fontSize="large"
                    sx={{ color: "#c75b7a" }}
                  />
                ),
                title: "Accessible Anywhere",
                description:
                  "Access your flashcards from any device, at any time. Study on the go with ease.",
              },
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 5,
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        "0 8px 16px rgba(255, 215, 0, 0.3), 0 4px 8px rgba(255, 215, 0, 0.2)",
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ mt: 1, color: "#4a4a4a" }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Pricing Section */}
        <Box sx={{ py: 8 }}>
          <Container>
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight="bold"
              gutterBottom
            >
              Pricing
            </Typography>
            <Grid container spacing={6} justifyContent="center">
              {[
                {
                  name: "Basic Plan",
                  price: "$0/month",
                  features: [
                    "Unlimited flashcards",
                    "Access on all devices",
                    "Basic AI features",
                  ],
                  buttonColor: "inherit",
                },
                {
                  name: "Pro Plan",
                  price: "$10/month",
                  features: [
                    "Everything in Basic",
                    "Advanced AI flashcard generation",
                    "Priority support",
                    "Early access to new features",
                  ],
                  buttonColor: "primary",
                },
              ].map((plan, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    elevation={6}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      textAlign: "center",
                      backgroundColor: "white",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow:
                          "0 12px 24px rgba(255, 215, 0, 0.35), 0 6px 12px rgba(255, 215, 0, 0.25)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ my: 2, color: "#570e0e", fontWeight: "bold" }}
                      >
                        {plan.price}
                      </Typography>
                      <Box
                        component="ul"
                        sx={{ textAlign: "left", mb: 3, px: 2 }}
                      >
                        {plan.features.map((feat, i) => (
                          <li
                            key={i}
                            style={{ marginBottom: "8px", color: "#555" }}
                          >
                            {feat}
                          </li>
                        ))}
                      </Box>
                      <Button
                        variant="contained"
                        color={plan.buttonColor}
                        sx={{
                          px: 5,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: "1rem",
                          borderRadius: "30px",
                        }}
                      >
                        Choose Plan
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
