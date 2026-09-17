// ============================================================
// THIS IS THE "FLASHCARD" PAGE (singular) — shows one individual
// saved set's cards, loaded via the ?name= query param. Reached
// by clicking a card on the "Flashcards" list page.
// ============================================================
 
'use client'
 
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from '../api/components/layout'
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google'
 
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-heading', display: 'swap' })
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
 
// Same paper-and-ink brand as the homepage, generate page, and flashcards list.
const INK = '#20242C'
const PARCHMENT = '#EDE8DA'
const CARDSTOCK = '#FBF7EE'
const MARKER = '#FFC933'
const PEN_TEAL = '#1E6E64'
 
const theme = createTheme({
  palette: {
    primary: { main: INK },
    secondary: { main: PEN_TEAL },
    background: { default: PARCHMENT, paper: CARDSTOCK },
    text: { primary: INK, secondary: '#54514A' },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: 'var(--font-body)',
    h4: { fontFamily: 'var(--font-heading)', fontWeight: 700, color: INK },
    button: { textTransform: 'none', fontWeight: 600 },
  },
})
 
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
 
  const searchParams = useSearchParams()
  const setName = searchParams.get('name') // Updated to match the query param key
 
  useEffect(() => {
    async function getFlashcardSet() {
      if (!setName || !user) return
 
      const setDocRef = doc(db, 'users', user.id, 'flashcardSets', setName)
      const setDocSnap = await getDoc(setDocRef)
 
      if (setDocSnap.exists()) {
        setFlashcards(setDocSnap.data().flashcards || [])
      } else {
        console.log('No flashcards found for this set.')
      }
    }
    getFlashcardSet()
  }, [setName, user])
 
  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={`${spaceGrotesk.variable} ${plexSans.variable}`} sx={{ backgroundColor: PARCHMENT, minHeight: '100vh' }}>
        <Layout>
          <Typography textAlign={'center'} sx={{ my: 3 }} variant="h4" component="h1" gutterBottom>
            {setName}
          </Typography>
          <Container maxWidth="md" sx={{ my: 3 }}>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      backgroundColor: CARDSTOCK,
                      border: '1px solid rgba(32,36,44,0.15)',
                      borderRadius: 2,
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleCardClick(index)}
                      sx={{ '&:focus-visible': { outline: `3px solid ${PEN_TEAL}`, outlineOffset: 2 } }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            perspective: '1000px',
                            '& > div': {
                              transition: 'transform 0.6s',
                              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                              transformStyle: 'preserve-3d',
                              position: 'relative',
                              width: '100%',
                              height: '200px',
                              transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              borderRadius: 2,
                              border: '1px solid rgba(32,36,44,0.15)',
                              textAlign: 'center',
                            },
                            '& > div > div:nth-of-type(1)': { backgroundColor: CARDSTOCK, boxShadow: '0 4px 10px rgba(32,36,44,0.12)' },
                            '& > div > div:nth-of-type(2)': {
                              backgroundColor: INK,
                              color: PARCHMENT,
                              transform: 'rotateY(180deg)',
                              boxShadow: '0 4px 10px rgba(32,36,44,0.2)',
                            },
                          }}
                        >
                          <div>
                            <div>
                              <Typography variant="caption" sx={{ color: PEN_TEAL, fontWeight: 700, letterSpacing: '0.04em', mb: 1 }}>
                                Q
                              </Typography>
                              <Typography>{flashcard.front}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" sx={{ color: MARKER, fontWeight: 700, letterSpacing: '0.04em', mb: 1 }}>
                                A
                              </Typography>
                              <Typography>{flashcard.back}</Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Layout>
      </Box>
    </ThemeProvider>
  )
}