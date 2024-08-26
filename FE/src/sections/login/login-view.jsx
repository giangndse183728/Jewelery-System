import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import request from 'src/request';

const defaultTheme = createTheme();

export default function LoginView() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await request.post('User/Login', { email, password });
      const { message, success, data } = response.data;
      if (!success) {
        toast.error(message);
        return;
      }
      localStorage.setItem('TOKEN', data.token);
      const token = jwtDecode(data.token);
      const role = token.role; // Extract role from token
      localStorage.setItem('ROLE', role);
      if (role === '1') {
        router.push('/dashboard');
        window.location.reload();
      } else if (role === '2') {
        router.push('/dashboard');
        window.location.reload();
      } else if (role === '3') {
        router.push('/sale');
        window.location.reload();
      }
    } catch (e) {
      toast.error('Error information login response');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/assets/background/jewbackground.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 12,
              mx: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="/assets/logo.svg"
              width="80"
              height="80"
              alt="logo"
            />
            <Typography component="h1" variant="h5" sx={{
              fontFamily: "'Henny Penny', -apple-system, Roboto, Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: '28px',
              lineHeight: '150%',
              mt: 1
            }}>
              Login
            </Typography>
            <Box component="form" noValidate sx={{ mt: 4 }}>
              <TextField
              sx={{ mb: 1 }}
                color="primary"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                color="primary"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                fullWidth
                size="large"
                onClick={handleClick}
                variant="contained"
                color="primary"
                sx={{ mt: 6, mb: 2 }}
              >
                Login
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
