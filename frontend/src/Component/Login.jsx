import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import twitty from "../assets/twitty.png"

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://chatterbox-production.up.railway.app/api/auth/login",
        // "http://localhost:3000/api/auth/login",
        input
      );
      // console.log(response);
      if (response && response.status === 200) {
        const token = response.data;
        // console.log(token);
        axios.defaults.headers.common["Authorization"] = token;
        localStorage.setItem("token", token);
        toast.success("Successfully logged in");
        navigate("/");
      }
    } catch (error) {
      console.log("Error in login", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.warning("Wrong email or password");
        } else if (error.response.status === 404) {
          toast.warning("User not registered. Please register.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        toast.error("No response from the server. Please check your internet connection.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="sm:w-auto w-80 p-6 bg-slate-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 flex flex-col gap-4 items-center">
      <img className="sm:w-28 sm:h-28 w-20 h-20 brightness-150" src={twitty} alt="" />
        <h1 className="text-center text-xl sm:text-3xl font-extrabold text-gray-100 mb-8">
          Login Chatterbox
        </h1>
        <form className="flex flex-col gap-1 w-full" onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="text-gray-100 text-md tracking-wide"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="sm:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="Email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
          <label
            htmlFor="password"
            className="text-gray-100 text-md tracking-wide"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="md:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="Password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />
          <button
            type="submit"
            className="button sm:w-96 bg-sky-700 hover:bg-sky-600 py-2 text-gray-100 text-lg font-semibold rounded-md tracking-wider"
          >
            Login
          </button>
          <div className="flex justify-center sm:w-96 gap-1 mt-2">
            <span className="text-gray-500">Don't have an account?</span>
            <Link to="/Signup" className="text-sky-700 hover:text-sky-500">
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
