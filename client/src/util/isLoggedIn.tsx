import api from "../api";
export default async () => {
  const isLoggedIn = document.cookie.match(
    /^(.*;)?\s*loggedIn\s*=\s*[^;]+(.*)?$/
  );
  if (isLoggedIn) return isLoggedIn;
  return await api
    .get("/v1/validToken")
    .then((response) =>  response.data.result);
};
