import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useTheme } from "@mui/material/styles";
import { replaceAll, reportCalculater, toTitleCase } from "../utility/tools";
import { Box, Grid, Skeleton } from "@mui/material";
import List from "@mui/material/List";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
export default function Report(props) {
  const { open, setOpen, transactions } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [report, setReport] = React.useState({});
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (open) getreport();
  }, [open]);

  const getreport = () => {
    const report = reportCalculater(transactions);
    if (report) setReport(report);
  };
  const nameIdExtract = (str) => {
    const arr = str.split("#");
    return {
      id: arr[0],
      name: arr[1],
    };
  };
  const relativePaymentKey = (str) => {
    const arr = str.split("-to-");
    return {
      from: nameIdExtract(arr[0]),
      to: nameIdExtract(arr[1]),
    };
  };

  const headingStyle = {
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  };
  const loader = (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Skeleton height={"400px"} width="100%" />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton height={"400px"} width="100%" />
      </Grid>
    </Grid>
  );
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="responsive-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <ReceiptLongIcon />
        <span>Expense Report</span>
      </DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}

        {Object.entries(report).length == 0 ? (
          loader
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  component="h2"
                  variant="body1"
                  color="text.primary"
                  sx={{ background: "#01579b", ...headingStyle }}
                >
                  Contributers
                </Typography>
                <Collabrators
                  created_payments={report?.created_payments}
                  nameIdExtract={nameIdExtract}
                  relativePaymentKey={relativePaymentKey}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ minWidth: "250px" }}>
                <Typography
                  component="h4"
                  variant="body1"
                  color="text.primary"
                  sx={{ background: "#e65100", ...headingStyle }}
                >
                  Pending Payments
                </Typography>
                <PendingPayments
                  pending_payments={report?.pending_payments}
                  nameIdExtract={nameIdExtract}
                  relativePaymentKey={relativePaymentKey}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={handleClose}>
          Close
        </Button>
        {/* <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
      </DialogActions>
    </Dialog>
  );
}
export function PendingPayments({
  pending_payments,
  nameIdExtract,
  relativePaymentKey,
}) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {Object.entries(pending_payments).map(([key, val]) => {
        const { from, to } = relativePaymentKey(key);
        return (
          <>
            <ListItem key={from.id + to.id} alignItems="flex-start">
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "nowrap",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <div>
                      Id:{""}
                      {from.id}
                      <br></br>
                      <span >
                        {toTitleCase(replaceAll(from.name, "_", " "))}
                      </span>
                    </div>
                    <KeyboardDoubleArrowRightIcon sx={{ color: "#FF8C00" }} />
                    <div>
                      Id:{""}
                      {to.id}
                      <br></br>
                      <span >
                        {toTitleCase(replaceAll(to.name, "_", " "))}
                      </span>
                    </div>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      component="h6"
                      variant="body1"
                      color="text.primary"
                    >
                      <strong>Have to pay: </strong>
                      <strong
                        style={{
                          color: val > 0 ? "red" : "green",
                          letterSpacing: "1px",
                        }}
                      >
                        ₹ {val}
                      </strong>
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </>
        );
      })}
    </List>
  );
}

export function Collabrators({
  created_payments,
  nameIdExtract,
  relativePaymentKey,
}) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {Object.entries(created_payments).map(([key, val]) => {
        const { id, name } = nameIdExtract(key);
        return (
          <>
            <ListItem alignItems="flex-start" key={id + name}>
              <ListItemAvatar>
                <Avatar alt={name} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <strong>{toTitleCase(replaceAll(name, "_", " "))}</strong>
                }
                secondary={
                  <Box>
                    <Typography
                      component="h6"
                      variant="body1"
                      color="text.primary"
                    >
                      Total pay:{" "}
                      <strong
                        style={{
                          color: val.total_spent < 0 ? "red" : "green",
                          letterSpacing: "1px",
                        }}
                      >
                        ₹ {val.total_spent}
                      </strong>
                    </Typography>
                    <Typography
                      component="p"
                      variant="body1"
                      color="text.primary"
                    >
                      Spent:{" "}
                      <strong
                        style={{
                          color: (val.total_spent - val.spent_on_self) < 0 ? "red" : "green",
                          letterSpacing: "1px",
                        }}
                      >
                        ₹ {val.spent_on_self}{` ${val.total_spent - val.spent_on_self<0 ? "-ve" : "+ve"}`}
                        
                      </strong>
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </>
        );
      })}
    </List>
  );
}
