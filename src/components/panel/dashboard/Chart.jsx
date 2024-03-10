import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, axisClasses } from "@mui/x-charts";

import Title from "./Title";
import DI from "../../utility/DI";
import { FetchContext } from "../SideBar";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount: amount ?? null };
}

const Chart = (props) => {
  const {
    di: { GET, error, urls },
  } = props;
  const [loading, setLoading] = React.useState(true);
  const [transaction, setTransaction] = React.useState([]);
  const { refresh } = React.useContext(FetchContext);
  const theme = useTheme();

  const getDetails = () => {
    setLoading(true);
    GET(urls.get.graphTransactions,{

    }).then((res) => {
      if (res?.success) {
        let transaction = props.transaction.sort((a, b) => {
          const dateA = new Date(a.expense_time);
          const dateB = new Date(b.expense_time);
          return dateA - dateB;
        });
        transaction = transaction.filter((item, index) => index < 60);
        let data = transaction.map((item) => {
          return createData(
            props.formatDate(item.expense_time),
            parseFloat(item.amount)
          );
        });
        setTransaction(res.data);
      } else {
        error(res?.message ?? "error");
      }
      setLoading(false);
    });
  };
  
  React.useEffect(()=>{
    getDetails()
  },[refresh])
  return (
    <React.Fragment>
      <Title>Your Recent Expenses</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <LineChart
          dataset={transaction}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "time",
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: "Expense (₹)",
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: 5000,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: "amount",
              area: true,
              // showMark: true,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: {
              stroke: theme.palette.text.secondary,
            },
            [`.${axisClasses.root} text`]: {
              fill: theme.palette.text.secondary,
            },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translateX(-25px)",
            },
          }}
        />
      </div>
    </React.Fragment>
  );
};
export default DI(Chart);
