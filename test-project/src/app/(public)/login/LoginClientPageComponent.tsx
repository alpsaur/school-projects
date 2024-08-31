"use client";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";

// Amplify configure is needed to ensure the requests contains the cookies.
Amplify.configure(config, { ssr: true });

function LoginClientPageComponent() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  useEffect(() => {
    const hubListenerCancel = Hub.listen("auth", (data) => {
      const { payload } = data;

      switch (payload.event) {
        case "signedIn":
          console.log("user have been signedIn successfully in login page");
          setIsSignedIn(true);
          break;
        case "signedOut":
          console.log("user have been signedOut successfully.");
          setIsSignedIn(false);
          break;
      }
    });
    return () => {
      hubListenerCancel();
    };
  });

  useEffect(() => {
    if (isSignedIn) {
      router.push("/projects");
    }
  }, [isSignedIn]);
  return <div>i am in login page</div>;
}

export default withAuthenticator(LoginClientPageComponent);
