import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DI from "../utility/DI";
import { CircularProgress } from "@mui/material";
import Footer from "../utility/Footer";
import { useNavigate } from "react-router-dom";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const Login = (props) => {
  const [loginSuccess,setLoginSuccess]=React.useState(false)
  const {
    di: {
      success,
      error,
      POST,
      urls,
      contextData: { setState },
    },
  } = props;
  const navigate=useNavigate()
  const [loading, setLoading] = React.useState(false);
  React.useEffect(()=>{
if(loginSuccess)
navigate('/panel');
  },[loginSuccess])
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (email && password) {
      setLoading(true);
      POST(urls.post.login, { email, password })
        .then((res) => {
          if (res.success) {
            setState((prev) => {
              return { ...prev, session: res.user };
            });
              setLoading(false);
              setLoginSuccess(true)

            success(res?.message);
          } else {
            setLoading(false);
            error(res?.message);
          }
        })
        .catch((er) => {
          setLoading(false);
          error("Refresh page & Try again.");
          console.log({ Error: er });
        });
    } else error("Please fill details.");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "80px" }}>
            <img
              style={{ width: "100%" }}
              src={"/transparent_logo.png"}
              alt={"spent_app"}
              loading="lazy"
            />
          </div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, px: 2 }}
          >
            <TextField
              margin="normal"
              required
              placeholder={"jai@gmail.com"}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder={"Maggi@123"}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              loading={true}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign In"
              )}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  onClick={() => navigate("/signup")}
                  style={{ cursor: "pointer" }}
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <div style={{ marginTop: "20px" }}>
          <Footer />
        </div>
      </Container>
    </ThemeProvider>
  );
};
export default DI(Login);
