import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import NavigationIcon from '@mui/icons-material/Navigation';

export default function FloatingAdd(props) {
  return (
  <div style={{position:'fixed',bottom:'3vh',right:'20px'}}>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab color="secondary" aria-label="add">
        <AddIcon  onClick={props.onclick} />
      </Fab>
      {/* <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab> */}
      {/* <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab> */}
      {/* <Fab disabled aria-label="like">
        <FavoriteIcon />
      </Fab> */}
    </Box>
  </div>
  );
}