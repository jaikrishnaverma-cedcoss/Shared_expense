import React, { useContext, useEffect, useState } from "react";
import Loader from "./utility/Loader";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../App";

const Onboarding = () => {
  const data = useContext(AppContext);
  const [loader, setLoader] = useState(true);
  const {
    state: { session },
  } = data;
  const navigate = useNavigate();
  useEffect(() => {
    if (session&&Object.keys(session) > 0) navigate("panel");
    else navigate("login");
    setLoader(false);
  }, []);
  if (loader) return <Loader />;

  return <Outlet />;
};

export default Onboarding;
