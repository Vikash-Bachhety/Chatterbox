import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import twitty from "../assets/twitty.png";

function Signup() {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm_password: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.password.length < 6) {
      toast.warning("Password should be greater than 6 characters");
      return;
    }
    try {
      const response = await axios.post(
        "chatterbox-production.up.railway.app/api/auth/signup" || "http://localhost:3000/api/auth/signup",
        input
      );
      if (response && response.status === 201) {
        const token = response.data;
        axios.defaults.headers.common["Authorization"] = token;
        localStorage.setItem("token", token);
        toast.success("Registration successfull");
        navigate("/");
      }
    } catch (error) {
      console.log("Error during signup:", error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning("User already registered. Please login.");
        } else if (error.response.status === 422) {
          toast.warning("Password do not matched.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your internet connection."
        );
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleGenderChange = (e) => {
    setInput({ ...input, gender: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:w-auto px-6 py-4 bg-slate-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 flex flex-col items-center">
        <img
          className="sm:w-28 sm:h-28 w-20 h-20 brightness-150"
          src={twitty}
          alt=""
        />
        <h1 className="text-center text-xl sm:text-3xl font-extrabold text-gray-100 mb-4">
          Signup Chatterbox
        </h1>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <label
            htmlFor="fullName"
            className="text-gray-100 text-lg tracking-wide"
          >
            Fullname
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="fullName"
            required
            className="sm:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="Full Name"
            value={input.fullName}
            onChange={(e) => setInput({ ...input, fullName: e.target.value })}
          />

          <label
            htmlFor="email"
            className="text-gray-100 text-md tracking-wide"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="sm:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="Email Address"
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
            autoComplete="new-password"
            required
            className="sm:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="Password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />

          <label
            htmlFor="confirm_password"
            className="text-gray-100 text-md tracking-wide"
          >
            Confirm password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete=""
            required
            className="sm:w-96 p-2 mb-2 text-black rounded-md outline-none focus:outline-blue-900"
            placeholder="confirm password"
            value={input.confirm_password}
            onChange={(e) =>
              setInput({ ...input, confirm_password: e.target.value })
            }
          />

          <div className="flex justify-center items-center gap-x-4 text-gray-100">
            <input
              id="male"
              name="gender"
              type="radio"
              value="male"
              required
              className="mr-2"
              checked={input.gender === "male"}
              onChange={handleGenderChange}
            />
            <label className="text-lg" htmlFor="male">
              Male
            </label>
            <input
              id="female"
              name="gender"
              type="radio"
              value="female"
              className="ml-4 mr-2"
              checked={input.gender === "female"}
              onChange={handleGenderChange}
            />
            <label className="text-lg" htmlFor="female">
              Female
            </label>
          </div>

          <button
            type="submit"
            className="button sm:w-96 bg-sky-700 hover:bg-sky-600 py-2 text-gray-100 text-lg font-semibold rounded-md tracking-wider"
          >
            Sign Up
          </button>

          <div className="flex justify-center sm:w-96 gap-1 mt-2">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/Login" className="text-sky-700 hover:text-sky-500">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
