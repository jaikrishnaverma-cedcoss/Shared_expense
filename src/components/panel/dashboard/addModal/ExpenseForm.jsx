import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { alpha } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Stack,
  TextareaAutosize,
  styled,
} from "@mui/material";
import DI from "../../../utility/DI";
import { noRef, regex, toTitleCase } from "../../../utility/tools";
import dayjs from "dayjs";
import "dayjs/locale/en-in"; // Import the Indian English locale

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AccountCircle } from "@mui/icons-material";
import { FetchContext } from "../../SideBar";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
dayjs.locale("en-in");
function isEvaluable(str) {
  try {
    eval(str);
    return true;
  } catch (error) {
    return false;
  }
}

const addamountregex = /^(?:\d+|[+-]?\d+[+-]\d+(?:[+-]\d+)*)$/gm;
const ExpenseForm = (props) => {
  const { setRefresh } = React.useContext(FetchContext);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [errors, setErrors] = React.useState({
    amount: { msg: "", show: false },
  });

  const {
    handleClose,
    di: { FAKE, GET, POST, urls, session, error, success },
  } = props;
  const [formdata, setformData] = React.useState({
    collabrators: [noRef({ id: session.id, firstname: session.firstname })],
    expense_detail: "",
    each_equal_share: true,
    amount: "",
    expense_time: dayjs(),
  });

  const fetchFriends = () => {
    setLoading(true);
    POST(urls.get.get_friends).then((res) => {
      if (res?.success) {
        setUsers(res.data);
      } else {
        error(res?.message ?? "error");
      }
      setLoading(false);
    });
  };
  React.useEffect(() => {
    fetchFriends();
  }, []);

  const submitHandler = () => {
    const { collabrators, expense_detail, expense_time, each_equal_share } =
      formdata;
    const amount = each_equal_share
      ? parseFloat(formdata.amount).toFixed(2)
      : collabrators
          .reduce((accumulator, item) => {
            return (accumulator += parseFloat(item.shared_amount));
          }, 0)
          .toFixed(2);
    const payload = {
      amount: parseFloat(amount),
      user_id: props?.di?.session?.id,
      collabrators: each_equal_share
        ? collabrators.map((item) => {
            return {
              ...item,
              shared_amount: (parseFloat(amount) / collabrators.length).toFixed(
                2
              ),
            };
          })
        : collabrators,
      expense_detail,
      self: collabrators.length === 1,
      each_equal_share: each_equal_share,
      paid: (collabrators.length === 1).toString(),
      expense_time: expense_time.format("ddd DD-MMM-YYYY hh:mm A"),
    };

    setLoading(true);
    POST(urls.post.set_transaction, {
      ...payload,
    }).then((res) => {
      if (res.success) {
        setformData({
          collabrators: [
            noRef({ id: session.id, firstname: session.firstname }),
          ],
          expense_detail: "",
          amount: "",
          expense_time: dayjs(),
        });
        success(res?.message);
        setRefresh((prev) => !prev);
        props.handleClose();
      } else {
        error(res?.message);
      }
      setLoading(false);
    });
  };

  const validator = () => {
    const { amount, expense_detail, each_equal_share, collabrators } = formdata;
    if (expense_detail == "") return error("Invalid or Empty Shares not allowed.");
    if (
      !each_equal_share &&
      collabrators.find(
        (el) =>
          !isEvaluable(el?.shared_amount) ||
          !(
            typeof el?.shared_amount == "string" ||
            typeof el?.shared_amount == "number"
          ) ||
          el?.shared_amount == undefined ||
          el?.shared_amount == "" ||
          errors?.["c_" + el.id]?.show
      )
    )
      return error("Invalid or Empty Shares not allowed.");
    if (
      each_equal_share &&
      (!(typeof amount == "string" || typeof amount == "number") ||
        amount == "" ||
        !isEvaluable(amount))
    )
      return error("Invalid or Empty Shares not allowed.");

    submitHandler();
  };



  return (
    <Stack spacing={{ xs: 3, sm: 2 }} direction="column" useFlexGap>
      <Autocomplete
        limitTags={3}
        // loading={true}
        defaultValue={[
          { ...noRef({ id: session.id, firstname: session.firstname }) },
        ]}
        sx={{ maxWidth: "100%" }}
        multiple
        // loadingText={loading}
        id="checkboxes-tags-demo"
        options={users}
        value={formdata.collabrators}
        getOptionLabel={(option) => option.firstname}
        onChange={(event, newValue) => {
          setformData((prev) => {
            prev.collabrators = [
              ...[
                noRef({
                  id: session.id,
                  firstname: session.firstname,
                  shared_amount:
                    prev?.collabrators?.find((item) => item.id == session.id)
                      ?.shared_amount ?? "",
                }),
              ],
              ...newValue
                .filter((option) => session.id != option.id)
                .map((option) => {
                  const alreadyIndex = prev.collabrators.findIndex(
                    (item) => item.id == option.id
                  );
                  if (alreadyIndex !== -1)
                    return prev.collabrators[alreadyIndex];
                  else return option;
                }),
            ];
            return { ...prev };
          });
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.firstname}
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
            {toTitleCase(option.firstname)}
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
      <FormControlLabel
        control={
          <PinkSwitch
            checked={formdata.each_equal_share}
            onChange={(e) => {
              setformData({
                ...formdata,
                each_equal_share: e.currentTarget.checked,
              });
            }}
          />
        }
        label="Equaly sharing"
      />
      {formdata.each_equal_share ? (
        <TextField
          id="outlined-number"
          label="(₹) Amount"
          type="text"
          value={formdata.amount}
          error={errors.amount.show && errors.amount.msg.length}
          helperText={
            errors.amount.show
              ? errors.amount.msg
              : formdata.amount && isEvaluable(formdata.amount)
              ? `Total: ${eval(formdata.amount)}`
              : "Total: "
          }
          onBlur={() => {
            setErrors((prev) => {
              prev.amount = {
                msg:
                  isEvaluable(formdata.amount) &&
                  parseInt(eval(formdata.amount)) > 0
                    ? ""
                    : "Enter a non negative and valid amount.",
                show: !(isEvaluable(formdata.amount) &&
                parseInt(eval(formdata.amount)) > 0),
              };
              return { ...prev };
            });
            if (isEvaluable(formdata.amount)) {
              setformData({ ...formdata, amount: eval(formdata.amount) });
            }
          }}
          onChange={(e) => {
            setErrors((prev) => {
              prev.amount.msg =
                isEvaluable(e.target.value) && eval(e.target.value) > 0
                  ? ""
                  : "Enter a non negative and valid amount.";
              prev.amount.show = false;
              return { ...prev };
            });

            setformData({ ...formdata, amount: e.target.value });
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : (
        formdata.collabrators.map((c, c_index) => {
          return (
            <TextField
              key={c.firstname + "s" + c.id}
              id="input-with-icon-textfield"
              label={"(₹) Amount of " + toTitleCase(c.firstname)}
              value={formdata.collabrators[c_index]?.["shared_amount"] ?? ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle style={{ color: "blue" }} />
                  </InputAdornment>
                ),
              }}
              error={
                errors?.["c_" + c.id]?.show &&
                errors?.["c_" + c.id]?.msg?.length
              }
              helperText={
                errors?.["c_" + c.id]?.show
                  ? errors?.["c_" + c.id]?.msg
                  : c?.["shared_amount"] && isEvaluable(c?.["shared_amount"])
                  ? `Total: ${eval(c?.["shared_amount"] ?? "")}`
                  : "Total: "
              }
              onBlur={() => {
                setErrors((prev) => {
                  prev["c_" + c.id] = {
                    msg:
                      isEvaluable(c?.["shared_amount"]) &&
                      parseInt(eval(c?.["shared_amount"])) > 0
                        ? ""
                        : "Enter a non negative and valid amount.",
                    show:  !(isEvaluable(c?.["shared_amount"]) &&
                    parseInt(eval(c?.["shared_amount"])) > 0),
                  };
                  return { ...prev };
                });
                if (isEvaluable(c?.["shared_amount"]))
                  setformData((prev) => {
                    prev.collabrators[c_index]["shared_amount"] = eval(
                      c?.["shared_amount"]
                    );
                    return { ...prev };
                  });
              }}
              onChange={(e) => {
                setErrors((prev) => {
                  prev["c_" + c.id] = {
                    msg:
                      isEvaluable(e.target.value) &&
                      parseInt(eval(e.target.value)) > 0
                        ? ""
                        : "Enter a non negative and valid amount.",
                    show: false,
                  };
                  return { ...prev };
                });
                setformData((prev) => {
                  prev.collabrators[c_index]["shared_amount"] = e.target.value;
                  return { ...prev };
                });
              }}
              variant="outlined"
            />
          );
        })
      )}

      <TextField
        label="Expense Type?"
        variant="outlined"
        color="warning"
        focused
        multiline
        onChange={(e) =>
          setformData({ ...formdata, expense_detail: e.target.value })
        }
        value={formdata.expense_detail}
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
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        {loading && <CircularProgress size={"0.875rem"} sx={{color:"white"}}/>}
       <span>   Add Expense</span>
        </div>
        </Button>
      </div>
    </Stack>
  );
};
export default DI(ExpenseForm);

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));
