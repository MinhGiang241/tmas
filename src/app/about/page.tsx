"use client";
import React from "react";

function About() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24">About Page</div>
      <div className="bg-red-700 w-36 h-16 mb-3" />
      <div className="bg-cyan-500 w-36 h-16 mb-3" />
      <div className="bg-purple-600 w-36 h-16 mb-3" />
      <button
        className="w-16 h-20 bg-blue-700 text-red-200 rounded-lg my-5"
        onClick={() => alert("Hello world")}
      >
        Click
      </button>

      <div className="bg-pink-500 w-36 h-16 mb-3" />
      <div className="bg-sky-700 w-36 h-16 mb-3" />
      <div className="bg-orange-700 w-36 h-16 mb-3" />
    </div>
  );
}

export default About;
