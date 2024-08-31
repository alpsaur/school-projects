import React from "react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex items-center bg-teal-300/30 h-full w-full">
      <p className="w-full font-bold text-white text-center">Loading ...</p>
    </div>
  );
}
