# Internet Identity Labs Motoko Bootcamp

## Step 0: Bootstrap and deploy project

Please follow the steps from [DFINITYs quickstart 10 min tutorial](https://internetcomputer.org/docs/current/developer-docs/quickstart/hello10mins)

You should end up with your deployed sample app looking like this:

![Step 0](./assets/step-0-success.png)

## Step 1: Getting the identity within the backend canister

On the backend, we want to retrieve the users identity to differentiate him from other users.

To get the identity we need to update our query function from:

```
actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
```

to:

```
import Principal "mo:base/Principal";

actor {
  public shared query({caller}) func greet(name : Text) : async Text {
    return "Hello, " # name # "! " # "Your PrincipalId is: " # Principal.toText(caller);
  };
};

```

when you deploy the changes with:

```
dfx deploy --network ic
```

And then again click the button, you should see the response:

![Step 1](./assets/step-1-success.png)

## Step 2: Getting an identity from II

the identity you've received in the previous step is the anonymous identity. Every unauthenticated call will have the same id.

But you are interested in the unique identity of your individual users. To get this, you need to request one from an Identity Provider (`IDP`). We'll use DFINITYs Internet Identity in the following steps.

We need to install DFINITYs `AuthClient` package to talk to the `IDP`:

```
npm install --save @dfinity/auth-client
```

Now we can add a login button to our `index.html` within `motoko_bootcamp_frontend`:

```Html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>motoko_bootcamp</title>
    <base href="/" />
    <link rel="icon" href="favicon.ico" />
    <link type="text/css" rel="stylesheet" href="main.css" />
  </head>
  <body>
    <main>
      <img src="logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <div>
        <button id="login">Log me in</button>
      </div>
      <div id="principalId"></div>
      <form action="#">
        <label for="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting"></section>
    </main>
  </body>
</html>

```

And a `onClick` handler to the `index.js`:

```JavaScript
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

```

Time to deploy again:

```
dfx deploy --network ic
```

When you click the button "Log me in", and running through the authentication process on Internet Identity, you'll see something like this:

![Step 2](./assets/step-2.png)

So we get the principalId on the frontend but the backend still doesn't retrieve it. Let's fix that in the next step.
