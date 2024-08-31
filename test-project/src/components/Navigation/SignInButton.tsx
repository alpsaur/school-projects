"use client";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import awsConfig from "@/amplifyconfiguration.json";

Amplify.configure(awsConfig);

const SignInButton = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <div>
      {isSignedIn ? (
        <Link href="/logout">
          <button className="h-12 rounded-lg bg-white font-bold px-5">
            Sign Out
          </button>
        </Link>
      ) : (
        <Link href="/login">
          <button className="h-12 rounded-lg bg-white font-bold px-5">
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
};

export default SignInButton;
