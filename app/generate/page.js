'use client'
 
import { useState, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardActionArea,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EditNoteIcon from '@mui/icons-material/EditNote'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase'
import { useUser } from '@clerk/nextjs'
import Layout from '../api/components/layout'
import { useRouter } from 'next/navigation'
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google'
 
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-heading', display: 'swap' })
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
 
// Same paper-and-ink brand as the homepage.
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
    h5: { fontFamily: 'var(--font-heading)', fontWeight: 600, color: INK },
    h6: { fontFamily: 'var(--font-heading)', fontWeight: 600, color: INK },
    button: { textTransform: 'none', fontWeight: 600 },
  },
})
 
const MIN_CHARS = 40
 
export default function Generate() {
  const { user, isLoaded } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [flipped, setFlipped] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState({ open: false, message: '', severity: 'success' })
 
  const router = useRouter()
 
  useEffect(() => {
    if (isLoaded && (!user || !user.id)) {
      router.push('/sign-in')
    }
  }, [user, isLoaded, router])
 
  const showNotice = (message, severity = 'success') => setNotice({ open: true, message, severity })
  const closeNotice = () => setNotice((n) => ({ ...n, open: false }))
 
  const handleSubmit = async () => {
    if (!text.trim()) {
      showNotice('Paste in some notes first — even a paragraph works.', 'warning')
      return
    }
 
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
 
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
 
      const data = await response.json()
      if (Array.isArray(data)) {
        setFlashcards(data)
        setFlipped(new Array(data.length).fill(false))
        showNotice(`Generated ${data.length} flashcard${data.length === 1 ? '' : 's'}.`)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error) {
      console.error('Error generating flashcards:', error)
      showNotice('Something went wrong generating your flashcards. Please try again.', 'error')
    } finally {
      setIsGenerating(false)
    }
  }
 
  const handleStartOver = () => {
    setText('')
    setFlashcards([])
    setFlipped([])
  }
 
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
 
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      showNotice('Give this set a name before saving.', 'warning')
      return
    }
 
    if (!user || !user.id) {
      showNotice('You need to be signed in to save flashcards.', 'error')
      return
    }
 
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      showNotice('There are no flashcards to save yet.', 'warning')
      return
    }
 
    setIsSaving(true)
    try {
      const userDocRef = doc(db, 'users', user.id)
      const userDocSnap = await getDoc(userDocRef)
 
      const batch = writeBatch(db)
 
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }
 
      const setDocRef = doc(userDocRef, 'flashcardSets', setName)
      batch.set(setDocRef, { flashcards })
 
      await batch.commit()
 
      showNotice('Flashcard set saved.')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      showNotice('Something went wrong saving your flashcards. Please try again.', 'error')
    } finally {
      setIsSaving(false)
    }
  }
 
  const handleCardClick = (index) => {
    setFlipped((prevFlipped) => prevFlipped.map((flip, i) => (i === index ? !flip : flip)))
  }
 
  const charCount = text.trim().length
  const canGenerate = charCount >= MIN_CHARS && !isGenerating
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={`${spaceGrotesk.variable} ${plexSans.variable}`} sx={{ backgroundColor: PARCHMENT, minHeight: '100vh' }}>
        <Layout>
          <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate flashcards
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4, maxWidth: 560 }}>
              Paste in your notes on the left. Flash AI reads them and writes a full deck of
              question-and-answer cards on the right.
            </Typography>
 
            <Grid container spacing={4}>
              {/* Input column */}
              <Grid item xs={12} md={5}>
                <Card
                  elevation={0}
                  sx={{
                    position: 'sticky',
                    top: 24,
                    p: 3,
                    backgroundColor: CARDSTOCK,
                    border: '1px solid rgba(32,36,44,0.15)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EditNoteIcon sx={{ color: PEN_TEAL }} />
                    <Typography variant="h6">Your notes</Typography>
                  </Box>
                  <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste a paragraph, a set of lecture notes, or a chapter summary..."
                    fullWidth
                    multiline
                    minRows={10}
                    maxRows={16}
                    variant="outlined"
                    sx={{
                      mb: 1,
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(32,36,44,0.25)' },
                        '&:hover fieldset': { borderColor: INK },
                        '&.Mui-focused fieldset': { borderColor: PEN_TEAL },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 2, color: charCount >= MIN_CHARS ? 'text.secondary' : '#B24A4A' }}
                  >
                    {charCount === 0
                      ? `Add at least ${MIN_CHARS} characters to generate a useful deck.`
                      : charCount < MIN_CHARS
                      ? `${MIN_CHARS - charCount} more characters needed`
                      : `${charCount} characters`}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!canGenerate}
                    fullWidth
                    startIcon={isGenerating ? <CircularProgress size={18} sx={{ color: INK }} /> : <AutoAwesomeIcon />}
                    sx={{
                      backgroundColor: MARKER,
                      color: INK,
                      py: 1.3,
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: '#E6B62E', boxShadow: 'none' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(32,36,44,0.12)', color: 'rgba(32,36,44,0.4)' },
                    }}
                  >
                    {isGenerating ? 'Generating…' : 'Generate flashcards'}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
                    <Button
                      variant="outlined"
                      href="/flashcards"
                      fullWidth
                      sx={{ color: INK, borderColor: INK, '&:hover': { borderColor: INK, backgroundColor: 'rgba(32,36,44,0.05)' } }}
                    >
                      Saved sets
                    </Button>
                    {(text || flashcards.length > 0) && (
                      <Button
                        onClick={handleStartOver}
                        startIcon={<RestartAltIcon />}
                        sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
                      >
                        Start over
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
 
              {/* Results column */}
              <Grid item xs={12} md={7}>
                {flashcards.length === 0 && !isGenerating && (
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 320,
                      border: '2px dashed rgba(32,36,44,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 4,
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 40, color: PEN_TEAL, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Your deck will show up here
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', maxWidth: 320 }}>
                      Longer, more detailed notes tend to produce better cards — a few full paragraphs
                      works better than a bullet list.
                    </Typography>
                  </Box>
                )}
 
                {isGenerating && (
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                    }}
                  >
                    <CircularProgress sx={{ color: PEN_TEAL }} />
                    <Typography sx={{ color: 'text.secondary' }}>Writing your flashcards…</Typography>
                  </Box>
                )}
 
                {flashcards.length > 0 && !isGenerating && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h6">Your flashcards</Typography>
                        <Chip label={`${flashcards.length} cards`} size="small" sx={{ backgroundColor: 'rgba(30,110,100,0.12)', color: PEN_TEAL, fontWeight: 600 }} />
                      </Box>
                      <Button
                        variant="contained"
                        onClick={handleOpenDialog}
                        sx={{
                          backgroundColor: MARKER,
                          color: INK,
                          boxShadow: 'none',
                          '&:hover': { backgroundColor: '#E6B62E', boxShadow: 'none' },
                        }}
                      >
                        Save set
                      </Button>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      Click a card to flip it.
                    </Typography>
                    <Grid container spacing={2}>
                      {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <CardActionArea
                            onClick={() => handleCardClick(index)}
                            aria-pressed={flipped[index]}
                            aria-label={`Flashcard ${index + 1}, tap to flip`}
                            sx={{
                              borderRadius: 2,
                              '&:focus-visible': { outline: `3px solid ${PEN_TEAL}`, outlineOffset: 2 },
                            }}
                          >
                            <Box
                              sx={{
                                perspective: '1000px',
                                '& > div': {
                                  transition: 'transform 0.5s ease',
                                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                                  transformStyle: 'preserve-3d',
                                  position: 'relative',
                                  width: '100%',
                                  height: '180px',
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
                                '& > div > div:nth-of-type(1)': {
                                  backgroundColor: CARDSTOCK,
                                  boxShadow: '0 4px 10px rgba(32,36,44,0.12)',
                                },
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
                          </CardActionArea>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
 
            <Dialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              PaperProps={{ sx: { backgroundColor: CARDSTOCK, borderRadius: 2 } }}
            >
              <DialogTitle>Save flashcard set</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ mb: 1 }}>
                  Give this set a name so you can find it later.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Set name"
                  type="text"
                  fullWidth
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveFlashcards()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: PEN_TEAL },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseDialog} sx={{ color: INK }} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  onClick={saveFlashcards}
                  variant="contained"
                  disabled={isSaving}
                  startIcon={isSaving ? <CircularProgress size={16} sx={{ color: INK }} /> : null}
                  sx={{
                    backgroundColor: MARKER,
                    color: INK,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#E6B62E', boxShadow: 'none' },
                  }}
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>
 
            <Snackbar open={notice.open} autoHideDuration={4000} onClose={closeNotice} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
              <Alert onClose={closeNotice} severity={notice.severity} variant="filled" sx={{ width: '100%' }}>
                {notice.message}
              </Alert>
            </Snackbar>
          </Container>
        </Layout>
      </Box>
    </ThemeProvider>
  )
}