![react-keycloak logo](images/logo.png)
# react-keycloak

![npm version](https://img.shields.io/npm/v/@digital-wafa/react-keycloak)
![build](https://img.shields.io/travis/digital-wafa/react-keycloak/master)
![codecov](https://img.shields.io/codecov/c/github/digital-wafa/react-keycloak/master)
![types](https://img.shields.io/npm/types/typescript)
![size](https://img.shields.io/bundlephobia/minzip/@digital-wafa/react-keycloak)
![downloads](https://img.shields.io/npm/dw/@digital-wafa/react-keycloak)
![license](https://img.shields.io/github/license/digital-wafa/react-keycloak)

---

a keycloak adapter for react with a protected route component that support react-router and reach-router

## Installation

```
npm i @digital-wafa/react-keycloak
```

## Usage

### KeycloakProvider:

you should create an instance of keyclaok using the `keycloak-js` package or importing the link from your keycloak server directly which is recommanded to avoid compatibily issues.

```javascript
const keycloakInstance = new Keycloak({
  url: "your keycloak url",
  realm: "your realm",
  clientId: "your client id",
  ....any other parameters
})
```

Then wrape your component with the keycloak provider, `KeycloakProvider` accept the following props :

| Props            | Required                                                    | Description                                                           |
| ---------------- | ------------------------------------------------------------| --------------------------------------------------------------------- |
| keycloak         | yes                                                         | the keycloak instance you created                                     |
| loginOptions     | no                                                          | keycloak login options                                                |
| initOptions      | no                                                          | keycloak init options                                                 |
| loadingComponent | only if you use the included `ProtectedRoute` component     | the loading component to show when redirecting to keycloak login page |

<br>

```javascript
import { KeycloakProvider } from "@digital-wafa/react-keycloak";


<KeycloakProvider
  keycloak={keycloak}
  loginOptions={{
    idpHint: "ei",
    scope: "phone",
  }}
>
  <App />
</KeycloakProvider>
```

finaly you can access the keycloak instance using the `useKeycloakContext` hook which return the following object: 

```javascript
{
  keycloak, // keycloak instance
  loginOptions, // keycloak login options
  initOptions, // keycloak init options
  authenticated // is the user authenticated or not
}
```

```javascript
import { useKeycloakContext } from "@digital-wafa/react-keycloak";

const {keycloak, authenticated, loginOptions, initOptions} = useKeycloakContext();
```

or import the context if you are using a class component 

```javascript
import { keycloakContext } from "@digital-wafa/react-keycloak"

...

class YourClassComponent extends React.Component {
  static contextType = keycloakContext;
  const {keycloak, authenticated, loginOptions, initOptions} = this.context;
} 
```

NB: the token is refreshed automatically when it expire using the `onTokenExpired` event.

<br>

### ProtectedRoute:
A useful component to protect your routes, it's compatible with `react-router-dom` and `@reach/router` 

if the user is authenticated, he will see the desired page, if not he will be redirected to the keycloak login page.

`react-router-dom` example:

```javascript
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ProtectedRoute } from "@digital-wafa/react-keycloak";

<Router>
    <ProtectedRoute
      RouteComponent={Route}
      ComponentToRender={YourPageComponent}
      path="/your-path"
    />
<Router>
```

`@reach/router` example:

when using `@reach/router` you don't need to use the `ComponentToRender` props

```javascript
import { Router } from "@reach/router";
import { ProtectedRoute } from "@digital-wafa/react-keycloak";

<Router>
    <ProtectedRoute
      RouteComponent={YourPageComponent}
      path="/your-path"
    />
<Router>
```

### getToken / getRefreshToken
Get the tokens which are stored automatically in `localStorage` after the login and the refreshToken actions.<br>
To use outside your components

```javascript
import { getToken, getRefreshToken } from "@digital-wafa/react-keycloak";

const token = getToken();
const refreshToken = getRefreshToken()
```