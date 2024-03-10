import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";
import ModalForm from "./dashboard/addModal/ModalForm";
import DI from "../utility/DI";
import Footer from "../utility/Footer";
import { toTitleCase } from "../utility/tools";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Avatar } from "@mui/material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export const FetchContext = React.createContext(false);
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name}`,
  };
}
function ResponsiveAppBar(props) {
  const {
    di: { session ,logout},
  } = props;
 
  const [refresh, setRefresh] = React.useState(false);
  const navigate = useNavigate();

  return (
    <FetchContext.Provider value={{ refresh, setRefresh }}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} onClick={()=>navigate('/panel')}>
              <div style={{ width: "100px", padding: "10px" }}>
                <img
                  style={{ width: "100%" }}
                  src={"/white_logo.png"}
                  alt={"spent_app"}
                  loading="lazy"
                />
              </div>
            </Box>
            <Box sx={{ display: { md: "none" }, mr: 1 }} onClick={()=>navigate('/panel')}>
              <div style={{ width: "80px", padding: "10px" }}>
                <img
                  style={{ width: "100%" }}
                  src={"/white_logo.png"}
                  alt={"spent_app"}
                  loading="lazy"
                />
              </div>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", borderLeft:"2px solid white",paddingLeft:"20px" } }}>
            <Avatar {...stringAvatar(session.id)} />
            </Box>

          
            <Box sx={{ display:"flex",alignItems:"center",gap:"20px" }}>
            <IconButton  onClick={()=>navigate('friends')}>
                <GroupAddIcon sx={{ color: "white" }} />
              </IconButton>
            <IconButton style={{transform:refresh?"rotate(180deg)":""}} onClick={()=>setRefresh(prev=>!prev)}>
                <RefreshIcon sx={{ color: "white" }} />
              </IconButton>
            
              <IconButton onClick={logout}>
                <LogoutIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
      disableGutters
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <div style={{ maxWidth: "100vw" }}>
          <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                minHeight: "calc(100vh - 160px)",
              }}
            >
              <div>
                <Outlet />
              </div>
              <Footer />
            </div>
          </Container>

       
        </div>
        <ModalForm />
      </Box>
    </FetchContext.Provider>
  );
}

export default DI(ResponsiveAppBar);
