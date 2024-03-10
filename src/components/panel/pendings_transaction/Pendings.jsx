import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DI from "../../utility/DI";
import Orders from "../dashboard/Orders";
import { formatDate } from "../../utility/tools";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import PaidIcon from "@mui/icons-material/Paid";
import { FetchContext } from "../SideBar";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabs = ["false", "true", null, "paid"];
const Pendings = (props) => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [transaction, setTransactions] = React.useState([]);
  const { refresh } = React.useContext(FetchContext);
  const [filter, setFilter] = React.useState({
    approval_status: false,
  });
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
      approval_status: filter.approval_status,
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
  }, [filter, refresh]);

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
  const makePaid = (transaction_id) => {
    setLoading(true);
    POST(urls.post.make_paid, {
      transaction_id: transaction_id,
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilter({ ...filter, approval_status: tabs[newValue] });
  };

  const deleteTransactions = (transaction_id) => {
    setLoading(true);
    POST(urls.post.delete_transaction, {
      transaction_id: transaction_id,
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
        >
          <Tab
            label="Pending"
            {...a11yProps(0)}
            iconPosition="start"
            icon={<HourglassFullIcon style={{ color: "orange" }} />}
          />
          <Tab
            label="Approved"
            {...a11yProps(1)}
            iconPosition="start"
            icon={<DoneAllIcon style={{ color: "green" }} />}
          />
          <Tab label="All" {...a11yProps(2)} />
          <Tab
            label="Paid"
            {...a11yProps(3)}
            iconPosition="start"
            icon={<PaidIcon style={{ color: "green" }} />}
          />
        </Tabs>
      </Box>
      <CustomTabPanel>
        <Orders
          key={filter.approval_status}
          transaction={transaction}
          formatDate={formatDate}
          loading={loading}
          changestatus={changestatus}
          deleteTransactions={
            filter.approval_status !== "paid" ? deleteTransactions : false
          }
          makePaid={(t_id) => {
            if (filter.approval_status === "true") makePaid(t_id);
            else error("Not approved by all collabrators.");
          }}
          transactionType={filter.approval_status}
          title="Transactions"
        />
      </CustomTabPanel>
    </Box>
  );
};

export default DI(Pendings);
