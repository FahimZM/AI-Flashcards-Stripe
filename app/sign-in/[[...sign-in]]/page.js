import { SignIn } from "@clerk/nextjs";
import { Container, Toolbar, Typography, AppBar, Button, Link, Box } from "@mui/material";

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw"> 
            {/* <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1,}}>
                        Flashcard Saas
                    </Typography>
                    <Button color='inherit'>
                        <Link href='/sign-in' passHref sx={{textDecoration: 'none', color: '#FFFFFF'}}>Login</Link>
                    </Button>
                    <Button color='inherit'>
                        <Link href='/sign-up' passHref sx={{textDecoration: 'none', color: '#FFFFFF'}}>Sign Up</Link>
                    </Button>
                </Toolbar>
            </AppBar> */}

            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Typography variant="h4" sx={{p: 2}}>Sign In</Typography>
                <SignIn fallbackRedirectUrl="/" />
            </Box>
        </Container>
    )
}