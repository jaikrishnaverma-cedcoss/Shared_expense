import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { environment } from "../../Env_data/environment";
import { fakeApiResponse } from "../fakeResponse";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { urlFetchCalls } from "../../Constant";
import { StepContent } from "@mui/material";
export const createQuery = (obj, initial = false) => {
  let str = initial ? "?" : "&";
  const arr = Object.entries(obj);
  arr.forEach(([key, val], i) => {
    const isLast = i === arr.length - 1;
    if (val !== "") str += `${key}=${val}${isLast ? "" : "&"}`;
  });

  return str?.length > 1 ? str : "";
};
const DI = (WrappedComponent) => {
  const base_url = environment.BASE_URL;

  const Wrapper = (props) => {
    const navigate = useNavigate();
    const contextData = useContext(AppContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const logout = () => {
      contextData.setState({ session: {} });
      localStorage.removeItem(environment.APP_NAME);
      navigate("/login");
    };
    const error = (msg) => {
      enqueueSnackbar(msg, {
        variant: "error",
      });
    };
    const success = (msg) => {
      enqueueSnackbar(msg, {
        variant: "success",
      });
    };
    const GET = useCallback(async (url, payload = {}) => {
      payload['auth_id']=contextData?.state?.session?.id??"";
      payload['bearer']= contextData?.state?.session?.bearer??"";
      try {
        const response = await fetch(
          `${base_url + url}` + createQuery(payload, true)
        );
        const data = response?.json() ?? {};
        if (!response.ok) {
       
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return data;
      } catch (error) {
        console.error("There was an error!", error);
      }
    }, []);

    const POST = useCallback(async (url, payload) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          auth_id: contextData?.state?.session?.id??"",
          bearer: contextData?.state?.session?.bearer??"",
        }),
      };
      try {
        const response = await fetch(`${base_url + url}`, requestOptions);

        const data = response?.json() ?? {
          success: false,
          message: "not json type",
        };

        // check for error response
        if (!response.ok) {
          console.log("API ERROR");
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        return data;
      } catch (error) {
        console.error("There was an error!", error);
      }
    }, []);

    const FAKE = useCallback(async (url, payload = {}) => {
      const data = await fakeApiResponse(url);
      return data;
    }, []);

    return (
      <WrappedComponent
        {...props}
        di={{
          contextData,
          session: contextData?.state?.session,
          GET,
          POST,
          FAKE,
          error,
          success,
          navigate,
          urls: urlFetchCalls,
          logout,
        }}
      />
    );
  };

  return Wrapper;
};

export default DI;
