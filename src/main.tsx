import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthClient } from '@dfinity/auth-client';
import { backend } from './declarations/backend';
import App from './Components/App';

//create log out button

const loginButton = document.getElementById("login") as HTMLButtonElement;

let principal: string ='';

const login = async () => {
  const authClient= await AuthClient.create();;
  const identityProviderUrl = 'https://identity.ic0.app/#authorize';

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    authClient.login({
      identityProvider: identityProviderUrl,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),//time in days, hours, etc...
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }

  return authClient;
}

async function handleAuthenticated(authClient: AuthClient) {
  const identity = authClient.getIdentity();
  principal = identity.getPrincipal().toString();
  let username: string;
  //check if user exists
  if (await backend.checkIfUserExists(principal)==true) {
    username = await backend.getUserById(principal);
  } else {
    var newUserName: string | null = await prompt("Enter a username of your choice")
    if (newUserName != null) {
      await backend.createUser(principal, newUserName);
      username = await backend.getUserById(principal);
    } else {
      //give default username
      username = "chainLinq User"
    }
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App id={principal} username={username} />
    </React.StrictMode>,
  );
  loginButton.innerHTML = "Logged In"
  loginButton.disabled = true;
}

export {principal};
// Add an event listener to the button
loginButton.addEventListener("click", login);
