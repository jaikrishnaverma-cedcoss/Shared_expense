import React, { useContext, useEffect, useMemo, useState } from "react";
import Loader from "./utility/Loader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { environment } from "../Env_data/environment";

const Onboarding = () => {
  const { APP_NAME } = environment;
  const { state, setState } = useContext(AppContext);
  const [loader, setLoader] = useState(true);
  const { session } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const [localChecked, setLocalChecked] = useState(false);
  /**
   * Local storage setup
   */

  useEffect(() => {
    if (localStorage.getItem(APP_NAME) != null) {
      let x = localStorage.getItem(APP_NAME);
      if (x != null) setState(JSON.parse(x));
    }
    setLocalChecked(true);
  }, []);

  useEffect(() => {

    if (state.session && Object.keys(state.session).length > 0)
      localStorage.setItem(APP_NAME, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (location.pathname) {
      if (session != null && session?.id) {
        if (
          location.pathname == "/login" ||
          location.pathname == "/" ||
          location.pathname == "/signup"
        )
          navigate("/panel");
      } else if (location.pathname !== "/signup") {
        navigate("/login");
      }
    setTimeout(()=>  setLoader(false),200)
    }
  }, [localChecked]);

  if (loader) return <Loader fullPage />;

  return <Outlet />;
};

export default Onboarding;
