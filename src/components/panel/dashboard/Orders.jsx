import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TableRow from "@mui/material/TableRow";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Title from "./Title";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Paper,
  Skeleton,
  TableContainer,
  TablePagination,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DI from "../../utility/DI";
import PersonIcon from "@mui/icons-material/Person";
import { reportCalculater, toTitleCase } from "../../utility/tools";
import { useTheme } from "@emotion/react";
import Report from "../../reports/Reports";
// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

const Orders = (props) => {
  const [open, setOpen] = React.useState(false);
  const {
    deleteTransactions,
    transactionType,
    changestatus,
    makePaid,
    di: { session, POST, urls, error },
  } = props;
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const formatDate = props.formatDate;
  const [selected, setSelected] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setPage(0);
  }, [props.transaction]);

  const visibleRows = React.useMemo(
    () =>
      props.transaction.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [page, rowsPerPage, props.transaction]
  );
  const isSelected = (id) => selected.includes(id);
  const handleClick = (e, id) => {
    const index = selected.findIndex((item_id) => item_id === id);
    setSelected((prev) => {
      if (index !== -1) prev.splice(index, 1);
      else prev.push(id);
      return [...prev];
    });
  };

  // React.useEffect(() => {

  // }, [selected]);

  const selectedAll = selected.length === props.transaction?.length;
  return (
    <React.Fragment>
      <Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <div>{props.title ? toTitleCase(props.title) : ""}</div>
          {selected.length !== 0 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpen(true)}
              startIcon={<QueryStatsIcon />}
            >
              Report({selected.length})
            </Button>
          )}
        </div>
      </Title>

      <TableContainer component={Paper}>
        <Table
          size="small"
          className="transaction--table"
          sx={{ minWidth: 600 }}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAll}
                  onClick={() => {
                    if (selectedAll) setSelected([]);
                    else setSelected(props.transaction?.map((item) => item.id));
                  }}
                />
              </TableCell>
              <TableCell>
                <strong>Id</strong>
              </TableCell>
              <TableCell>
                <strong>Amount (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Collabrators (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Paid</strong>
              </TableCell>
              <TableCell>
                <strong>Expense Detail</strong>
              </TableCell>
              <TableCell>
                <strong>Each Share</strong>
              </TableCell>
              <TableCell>
                <strong>Expense Time</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Created At</strong>
              </TableCell>
              {transactionType !== "paid" && (
                <TableCell align="right">
                  <strong>Action</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {props?.loading || visibleRows.length == 0 ? (
              <>
                {props?.loading ? (
                  Array(rowsPerPage)
                    .fill("t_rows")
                    .map((el, index) => (
                      <TableRow key={el + index}>
                        {Array(9)
                          .fill("t_col")
                          .map((cl, i) => (
                            <TableCell key={cl + i}>
                              <Skeleton minWidth="100%" height={"35px"} />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: "center" }}
                      className="no-transaction-cell"
                    >
                      <h1>
                        <ReceiptLongIcon fontSize="100" />
                      </h1>
                      No transactions Available
                    </td>
                  </tr>
                )}
              </>
            ) : (
              visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                const isHe =
                  row.collaborators.find((item) => item.id == session.id)
                    .transaction_type === "Cr";
                return (
                  <TableRow
                    key={row.id}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      background: isHe ? "#c4ffc4b3" : "#ffcbcb9e",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <strong>{"₹ " + row.amount + " "}</strong>
                      <strong
                        style={{
                          color: row.user_id == session.id ? "green" : "red",
                        }}
                      >
                        {row.user_id == session.id ? "Cr." : "Dr."}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          justifyContent: "start",
                          gap: "5px",
                          flexDirection: "column",
                          flexWrap: "wrap",
                        }}
                      >
                        {row.collaborators
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((item) => (
                            <div
                              key={item.id + row.id}
                              style={{
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: "10px",
                              }}
                              onClick={() => {
                                if (
                                  transactionType !== "paid" &&
                                  changestatus &&
                                  item.id == session.id
                                )
                                  changestatus(row.id, item.id, item.approved);
                              }}
                            >
                              <button
                                className="button--change"
                                style={{
                                  textAlign: "center",
                                  border: "none",
                                  whiteSpace: "nowrap",
                                  padding: "1px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "10px",
                                  fontSize: "14px",
                                  color: "white",
                                  height: "28px",
                                  background:
                                    item.approved == "true" ? "green" : "red",
                                  paddingLeft:
                                    item.id == row.user_id ? "1px" : "5px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                {item.id == row.user_id && <PersonIcon />}
                                {toTitleCase(item.name)}
                                <span
                                  style={{
                                    height: "100%",
                                    fontSize: "18px",
                                    padding: "0px 5px",
                                    textAlign: "center",
                                    fontWeight: "600",

                                    color:
                                      item.approved == "true" ? "green" : "red",
                                    background: "white",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {item.shared_amount}
                                </span>
                                {changestatus && item.id == session.id && (
                                  <AdsClickIcon />
                                )}
                                {item.approved == "true" && <DoneAllIcon />}
                              </button>
                            </div>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        if (
                          row.user_id == session.id &&
                          row.paid == "false" &&
                          transactionType !== "paid"
                        ) {
                          const tic = window.confirm(
                            "Are you sure you get that amount?"
                          );
                          if (tic) makePaid(row.id);
                        }
                      }}
                    >
                      {
                        <span
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            margin: "2px 0px",
                            color: "white",
                            cursor:
                              row.user_id == session.id
                                ? "pointer"
                                : "not-allowed",
                            background:
                              row.paid == "false"
                                ? `${
                                    row.user_id == session.id ? "red" : "grey"
                                  }`
                                : "green",
                            borderRadius: "5px",
                          }}
                        >
                          {row.paid == "false" ? "Pending" : "Paid"}
                        </span>
                      }
                    </TableCell>
                    <TableCell>
                      <b style={{ color: "grey" }}>{row.expense_detail}</b>
                    </TableCell>
                    <TableCell>
                      {row.each_share ? "Equally" : "Distinct"}
                    </TableCell>
                    <TableCell>{formatDate(row.expense_time)}</TableCell>

                    <TableCell>{formatDate(row.created_at)}</TableCell>
                    {transactionType !== "paid" && (
                      <TableCell align="right">
                        <Button
                          disabled={row.user_id !== session.id}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            if (row.user_id == session.id) {
                              const tic = window.confirm(
                                "Are you sure you want delete this transaction?"
                              );
                              if (tic) deleteTransactions(row.id);
                            }
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
            {/* {Array(emptyRows).map((item,ind)=>
              <TableRow key={ind+'empty'}>
               {
                Array(8).fill( <TableCell>
                  <Box width={"100%"} height={"32px"}></Box>
                </TableCell>)
               }
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      {props.transaction.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.transaction.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Report
        transactions={
          props?.transaction?.filter((tr) => selected.includes(tr.id)) ?? []
        }
        open={open}
        setOpen={setOpen}
      />
    </React.Fragment>
  );
};
export default DI(Orders);
