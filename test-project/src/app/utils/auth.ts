import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/app/utils/amplifyServerUtils";
import { cookies } from "next/headers";
import { AuthSession } from "aws-amplify/auth";

/**
 * Retrieves the currently authenticated user using AWS Amplify's server-side utilities.
 *
 * This function runs within the Amplify server context to securely fetch the currently authenticated user's details,
 * including their username and userId. It utilizes the `runWithAmplifyServerContext` function to pass in the necessary
 * context, including cookies for authentication.
 *
 * @async
 * @function currentAuthenticatedUser
 * @returns {Promise<{ username: string, userId: string } | undefined>}
 *          - Resolves with an object containing the username and userId if the user is authenticated.
 *          - Returns `undefined` if the user is not authenticated or if an error occurs during the operation.
 *
 * @throws {Error} If there is an issue with retrieving the current authenticated user, the function catches the error and returns `undefined`.
 *
 * @example
 * const user = await currentAuthenticatedUser();
 * if (user) {
 *   console.log(`User is authenticated: ${user.username}`);
 * } else {
 *   console.log("No authenticated user found.");
 * }
 */
async function currentAuthenticatedUser(): Promise<
  { username: string; userId: string } | undefined
> {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });

    if (!currentUser) {
      return undefined;
    }

    const { username, userId } = currentUser;
    return { username: username, userId: userId };
  } catch (err) {
    return undefined;
  }
}

async function currentAuthSession(
  request?: NextRequest
): Promise<AuthSession | undefined> {
  try {
    // console.log("request", "i am a request");
    // console.log("request object", request);
    const response = NextResponse.next();
    if (request) {
      const session = await runWithAmplifyServerContext({
        nextServerContext: { request, response },
        operation: (contextSpec) => fetchAuthSession(contextSpec),
      });
      return session;
    } else {
      // console.log("cookies", "i am a cookie");
      const session = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => fetchAuthSession(contextSpec),
      });
      return session;
    }
  } catch (err) {
    console.debug("session is undefined from try catch");
    return undefined;
  }
}

export { currentAuthenticatedUser, currentAuthSession };
