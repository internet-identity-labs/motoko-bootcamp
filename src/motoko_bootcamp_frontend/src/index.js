import { Actor } from "@dfinity/agent";
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

  Actor.agentOf(motoko_bootcamp_backend).replaceIdentity(
    authClient.getIdentity()
  );
}

document.getElementById("login").addEventListener("click", async (e) => {
  if (!authClient) throw new Error("AuthClient not initialized");

  const APP_NAME = "Litzi's Motoko Bootcamp";
  const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
  const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

  const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

  authClient.login({
    identityProvider,
    onSuccess: handleSuccess,
  });
});

init();
