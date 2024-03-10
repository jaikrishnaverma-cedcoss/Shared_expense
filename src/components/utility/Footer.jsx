import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

export function Copyright() {
  return (
    <Typography variant="p" color="text.secondary">
      {`Copyright ©${new Date().getFullYear()} Expense Manager, `}
      Reach me here:{" "}
      <Link href="https://jais-portfolio.vercel.app/">
        Jai's Portfolio
      </Link>{" "}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
        }}
      >
        <Container maxWidth="sm">
       <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",gap:"30px"}}>
       <div style={{width:"100px"}}>
         <img
         style={{width:'100%'}}
            src={"/transparent_logo.png"}
            alt={"spent_app"}
            loading="lazy"
          />
         </div>
          <Copyright />
       </div>
        </Container>
      </Box>
    </Box>
  );
}
