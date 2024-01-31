import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Button,
  Card,
  Chip,
  FormGroup,
  Grid,
  Stack,
  TextareaAutosize,
} from "@mui/material";
import DI from "../../../utility/DependenciesInjection";
import { noRef, regex, toTitleCase } from "../../../utility/tools";
import dayjs from "dayjs";
import "dayjs/locale/en-in"; // Import the Indian English locale

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
dayjs.locale("en-in");
const ExpenseForm = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);

  const {
    handleClose,
    di: { FAKE, session, error, success },
  } = props;
  const [formdata, setformData] = React.useState({
    collabrators: [noRef(session)],
    expense_detail: "",
    amount: "",
    expense_time: dayjs(),
  });

  const fetchUsers = () => {
    setLoading(true);
    FAKE("users").then((res) => {
      if (res.success) {
        setUsers(
          res.data.map((el) => {
            return { ...el, title: el.firstName };
          })
        );
      } else {
        error(res?.msg);
      }
      setLoading(false);
    });
  };
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const submitHandler = () => {
    const { amount, collabrators, expense_detail,expense_time} = formdata;
    const payload = {
      amount:parseFloat(amount),
      collabrators:collabrators.map(item=>item.id),
      expense_detail,
      self:collabrators.length===1,
      each_share:parseFloat(amount)/collabrators.length,
      expense_verified:collabrators.map(item=>item.id),
      paid:collabrators.length===1,
      expense_time: expense_time.format('ddd DD-MMM-YYYY hh:mm A'),
      comments:[]
    };
  
    setLoading(true);
    FAKE("success_endpoint").then((res) => {
      if (res.success) {
        console.log({expense_add:payload})
        setformData({
          collabrators: [noRef(session)],
          expense_detail: "",
          amount: "",
          expense_time:dayjs(),
        });
        success(res?.msg);
      } else {
        error(res?.msg);
      }
      setLoading(false);
    });
  };
  const validator = () => {
    const { amount, expense_detail } = formdata;
    if (expense_detail == "" || amount == "")
      return error("Fields cant be empty.");
    else submitHandler();
  };
  return (
    <Stack spacing={{ xs: 3, sm: 2 }} direction="column" useFlexGap>
      <Autocomplete
        limitTags={3}
        loading={true}
        defaultValue={[{ ...session }]}
        sx={{ maxWidth: "100%" }}
        multiple
        loadingText={loading}
        id="checkboxes-tags-demo"
        options={users}
        value={formdata.collabrators}
        disableCloseOnSelect
        getOptionLabel={(option) => option.firstName}
        onChange={(event, newValue) => {
          setformData({
            ...formdata,
            collabrators: [
              ...[session],
              ...newValue.filter((option) => session.id !== option.id),
            ],
          });
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.firstName}
              {...getTagProps({ index })}
              disabled={session.id === option.id}
            />
          ))
        }
        renderOption={(props, option, { selected }) => (
          <li {...(session.id === option.id ? {} : { ...props })}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              disabled={session.id === option.id}
              checked={session.id === option.id || selected}
            />
            {toTitleCase(option.firstName)}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Collabrators"
            placeholder="Collabrators"
          />
        )}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Expense Time"
          defaultValue={dayjs()}
          onChange={(val) => {
            setformData({ ...formdata, expense_time: val });
          }}
        />
      </LocalizationProvider>
      <TextField
        id="outlined-number"
        label="Amount"
        type="text"
        value={formdata.amount}
        onChange={(e) => {
          if (
            regex.nonNegativeIntFloat.test(e.target.value) ||
            e.target.value == ""
          )
            setformData({ ...formdata, amount: e.target.value });
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Expense Type?"
        variant="standard"
        color="warning"
        focused
        multiline
        onChange={(e) =>
          setformData({ ...formdata, expense_detail: e.target.value })
        }
        value={formdata.expense_detail}
      />
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={validator}
          color="success"
          disabled={loading}
        >
          Add Expense
        </Button>
      </div>
    </Stack>
  );
};
export default DI(ExpenseForm);
