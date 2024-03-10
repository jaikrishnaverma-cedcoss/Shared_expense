import { createContext, useEffect, useState } from "react";
import "./App.css";
import Onboarding from "./components/Onboarding";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { SnackbarProvider } from "notistack";
import SideBar from "./components/panel/SideBar";
import Dashboard from "./components/panel/dashboard/Dashboard";
import AddExpense from "./components/panel/add/AddExpense";
import Pendings from "./components/panel/pendings_transaction/Pendings";
import Fallback from "./components/utility/Fallback";
import Friends from "./components/panel/dashboard/Friends";
export const AppContext = createContext(null);

function App() {
  const [state, setState] = useState({
    session: null,
    database: {},
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Onboarding />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "panel",
          element: <SideBar />,
          children: [
            {
              path: "",
              element: <Dashboard />,
            },
            {
              path: "friends",
              element: <Friends />,
            },
            {
              path: "create_expense",
              element: <AddExpense />,
            },
            {
              path: "transactions",
              element: <Pendings />,
            },
            {
              path:'*',
              element:<Fallback title={'No such page found.'}/>
            }
          ],
        },
        {
          path:'*',
          element:<Fallback fullScreen title={'Outside Route Detect.'}/>
        }
      ],
    },
  ]);
  return (
    <AppContext.Provider value={{ state, setState }}>
      <SnackbarProvider autoHideDuration={3000} maxSnack={2}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
}

export default App;
