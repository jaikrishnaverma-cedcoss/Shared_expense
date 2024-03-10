import { Copyright } from "@mui/icons-material";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import DI from "../../utility/DI";
import { formatDate, toTitleCase } from "../../utility/tools";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { FetchContext } from "../SideBar";
import Pendings from "../pendings_transaction/Pendings";

const Dashboard = (props) => {
  const { refresh } = useContext(FetchContext);
  const [loading, setLoading] = React.useState(true);
  const [transaction, setTransactions] = React.useState([]);
  const [details, setDetails] = React.useState({
    balance: 0,
    till_date: "",
  });
  const {
    di: { GET, POST, urls, error, success, session },
  } = props;
  const fetchTransactions = async () => {
    setLoading(true);
    await GET(urls.get.get_transactions, {
      user_id: session?.id,
      // approval_status:'true'
    }).then((res) => {
      if (res?.success) {
        setTransactions(res.data);
        setDetails({
          balance: res.total_approved_balance,
          till_date: res.till_date,
        });
      } else {
        error(res?.message ?? "error");
      }
      setLoading(false);
    });
  };
  React.useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const changestatus = (
    transaction_id,
    collaborator_id,
    curr_approval_status
  ) => {
    setLoading(true);
    POST(urls.post.change_status, {
      transaction_id: transaction_id,
      collabrator_id: collaborator_id,
      approved: curr_approval_status == "false" ? "true" : "false",
    }).then((res) => {
      if (res.success) {
        success(res.message);
        fetchTransactions();
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Box component="main" sx={{ mt: 2, mb: 2 }} maxWidth="sm">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>
            <AccountBoxIcon sx={{color:"orange",fontSize:"50px"}} />
          </div>
          <Typography variant="h5" component="h5" sx={{margin:"0px",color:"#1976d2"}} gutterBottom>
            {`${toTitleCase(session?.firstname)} ${toTitleCase(
              session?.lastname
            )}`}
          </Typography>
        </div>
        <Typography variant="p" component="p" sx={{color:"grey",marginLeft:1}} gutterBottom>
          {"It is always preferable to receive reports from the 'Approved' tab."}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 340,
            }}
          >
            <Chart transaction={transaction} formatDate={formatDate} />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        {/* <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Deposits details={details} />
          </Paper>
        </Grid> */}
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 0, display: "flex", flexDirection: "column" }}>
            {/* <Orders
              transaction={transaction}
              formatDate={formatDate}
              title="Recent Transactions"
              changestatus={changestatus}
            /> */}
            <Pendings />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </>
  );
};

export default DI(Dashboard);
