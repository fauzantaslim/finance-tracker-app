import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../services/auth.service";

export const useLogin = () => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      try {
        const userInfo = getUserInfo(accessToken);
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return userInfo;
};
