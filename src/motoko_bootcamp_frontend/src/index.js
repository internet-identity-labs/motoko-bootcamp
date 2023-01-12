import { AuthClient } from "@dfinity/auth-client";
import { motoko_bootcamp_backend } from "../../declarations/motoko_bootcamp_backend";

let authClient = null;

async function init() {
  authClient = await AuthClient.create();
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const name = document.getElementById("name").value.toString();

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  const greeting = await motoko_bootcamp_backend.greet(name);

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greeting;

  return false;
});

function handleSuccess() {
  const principalId = authClient.getIdentity().getPrincipal().toText();

  document.getElementById(
    "principalId"
  ).innerText = `Your PrincipalId: ${principalId}`;
}

document.getElementById("login").addEventListener("click", async (e) => {
  if (!authClient) throw new Error("AuthClient not initialized");

  authClient.login({
    onSuccess: handleSuccess,
  });
});

init();
