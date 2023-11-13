import queryString from "query-string";
import { API_URL, JWT, Usuario, captureToken, get } from ".";
import { UseApiMutationOptions, useApiMutation } from "@/hooks";

const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI: string = `${
  import.meta.env.VITE_BASE_URL || "http://localhost:5173"
}/auth/redirect/google`;

const stringifiedParams = queryString.stringify({
  client_id: GOOGLE_CLIENT_ID,
  // Esta redirect_uri debe la misma que se configuró en las credenciales de Google.
  redirect_uri: GOOGLE_REDIRECT_URI,
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" "), // space seperated string
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
});

export const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

/** Hace el login del usuario mediante OAuth2 con Google como provider. */
export function useGoogleLogin(
  options?: UseApiMutationOptions<{ code: string }, Usuario>
) {
  return useApiMutation({
    ...options,
    mutationFn: ({ code }) =>
      get<JWT>(`${API_URL}/oauth2/redirect/google?code=${code}`).then(
        captureToken
      ),
  });
}
