'use client'
 
import { useEffect, useState } from 'react'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import Layout from '../api/components/layout'
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google'
 
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-heading', display: 'swap' })
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
 
// Same paper-and-ink brand as the homepage and generate page.
const INK = '#20242C'
const PARCHMENT = '#EDE8DA'
const CARDSTOCK = '#FBF7EE'
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
    h5: { fontFamily: 'var(--font-heading)', fontWeight: 600, color: INK },
    button: { textTransform: 'none', fontWeight: 600 },
  },
})
 
export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcardSets, setFlashcardSets] = useState([])
  const router = useRouter()
 
  useEffect(() => {
    async function getFlashcardSets() {
      if (!isLoaded || !isSignedIn || !user) {
        return
      }
 
      try {
        const userDocRef = doc(db, 'users', user.id)
        const userDocSnap = await getDoc(userDocRef)
 
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setFlashcardSets(userData.flashcardSets || [])
        } else {
          console.log('No flashcard sets found for this user.')
        }
      } catch (error) {
        console.error('Error fetching flashcard sets:', error)
      }
    }
 
    getFlashcardSets()
  }, [isLoaded, isSignedIn, user])
 
  const handleCardClick = (id) => {
    router.push(`/flashcard?name=${id}`)
  }
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={`${spaceGrotesk.variable} ${plexSans.variable}`} sx={{ backgroundColor: PARCHMENT, minHeight: '100vh' }}>
        <Layout>
          <Typography textAlign={'center'} sx={{ my: 3 }} variant="h4" component="h1" gutterBottom>
            Saved Flashcards
          </Typography>
          <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {flashcardSets.map((set, idx) => {
                const rotate = idx % 3 === 0 ? -1.5 : idx % 3 === 1 ? 0.5 : 1.5
                return (
                  <Grid item xs={12} sm={6} md={4} key={set.name}>
                    <Card
                      elevation={0}
                      sx={{
                        position: 'relative',
                        backgroundColor: CARDSTOCK,
                        border: '1px solid rgba(32,36,44,0.15)',
                        borderRadius: 2,
                        transform: `rotate(${rotate}deg)`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                        '&:hover': { transform: 'rotate(0deg) translateY(-4px)', boxShadow: '0 8px 16px rgba(32,36,44,0.15)' },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: PEN_TEAL,
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleCardClick(set.name)}
                        sx={{ '&:focus-visible': { outline: `3px solid ${PEN_TEAL}`, outlineOffset: 2 } }}
                      >
                        <CardContent>
                          <Typography variant="h5" component="div">
                            {set.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Container>
        </Layout>
      </Box>
    </ThemeProvider>
  )
}