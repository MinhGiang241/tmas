"use client";

import React from "react";

function Blog() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around w-full">
        <div className="w-56 h-40 bg-red-700" />
        <div className="w-56 h-40 bg-blue-700" />
        <div className="w-56 h-40 bg-orange-700" />
        <div className="w-56 h-40 bg-teal-700" />
      </div>
      <div>Hello World</div>
      <button
        className="w-16 h-20 bg-blue-700 text-red-200 rounded-lg my-5"
        onClick={() => alert("Hello world")}
      >
        Click
      </button>
      <div className="flex justify-around w-full">
        <div className="w-56 h-40 bg-red-700" />
        <div className="w-56 h-40 bg-blue-700" />
        <div className="w-56 h-40 bg-orange-700" />
        <div className="w-56 h-40 bg-teal-700" />
      </div>
    </div>
  );
}

export default Blog;
