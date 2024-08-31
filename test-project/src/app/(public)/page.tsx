import React from "react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";

Amplify.configure(config, { ssr: true });

export default async function Home() {
  return (
    <div
      className="flex items-center justify-center h-full bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/structural_engineer.jpg)",
      }}
    >
      <div className="mx-5 flex items-center justify-center py-5 px-2 rounded-lg shadow-lg">
        <p className="text-8xl font-bold text-white">
          Welcome to the IBIS System
        </p>
      </div>
    </div>
  );
}
