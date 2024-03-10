import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { Box } from "@mui/material";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits({ details }) {
  const { balance, till_date } = details;
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* <Box> */}
      <Title>Your Approved Balance </Title>
      <CurrencyRupeeIcon style={{color:"grey"}}/>
      <Typography
        component="p"
        variant="h4"
        style={{ color: parseFloat(balance) >= 0 ? "blue" : "red" }}
      >
        {balance} 
      </Typography>
      {/* </Box> */}

      <Box>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          {till_date}
        </Typography>
      </Box>
    </Box>
  );
}
