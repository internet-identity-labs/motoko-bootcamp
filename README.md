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
