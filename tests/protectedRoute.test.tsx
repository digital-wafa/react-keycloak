import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { KeycloakProvider } from "../src/keycloakContext";
import ProtectedRoute from "../src/protectedRoute";
import { MemoryRouter, Route } from "react-router-dom";
import { Router } from "@reach/router";

const keycloakInstance = {
  token: "token",
  refreshToken: "refresh token",
  init: jest.fn().mockResolvedValue(true),
  login: jest.fn(),
};

const loginOptions = {
  idpHint: "ei",
  scope: "phone",
};

const ReactRouterPage = () => {
  return <div>Profile page :D</div>;
};

const ReachRouterPage = () => <div>Home</div>;

describe("ProtectedRoute", () => {
  it("should init keycloak with the default value", async () => {
    render(
      <KeycloakProvider
        //@ts-ignore
        keycloak={keycloakInstance}
        loadingComponent={<div>...loading</div>}
      >
        <ProtectedRoute
          RouteComponent={() => <div>Route component</div>}
          path="/profile"
        />
      </KeycloakProvider>
    );
    expect(keycloakInstance.init).toBeCalledTimes(1);
    expect(keycloakInstance.init).toBeCalledWith({
      promiseType: "native",
      checkLoginIframe: false,
    });
    const loading = await screen.findByText("...loading");
    expect(loading).toBeInTheDocument();
  });

  it("should init keycloak with the provided value", async () => {
    keycloakInstance.init.mockClear();
    render(
      <KeycloakProvider
        //@ts-ignore
        keycloak={keycloakInstance}
        initOptions={{ checkLoginIframe: true }}
        loadingComponent={<div>...loading</div>}
      >
        <ProtectedRoute
          RouteComponent={() => <div>Route component</div>}
          path="/profile"
        />
      </KeycloakProvider>
    );
    expect(keycloakInstance.init).toBeCalledTimes(1);
    expect(keycloakInstance.init).toBeCalledWith({
      promiseType: "native",
      checkLoginIframe: true,
    });
    const loading = await screen.findByText("...loading");
    expect(loading).toBeInTheDocument();
  });

  it("should call the login method", async () => {
    keycloakInstance.init.mockClear();
    keycloakInstance.init.mockResolvedValue(false);
    render(
      <KeycloakProvider
        //@ts-ignore
        keycloak={keycloakInstance}
        loginOptions={loginOptions}
        loadingComponent={<div>...loading</div>}
      >
        <ProtectedRoute
          RouteComponent={() => <div>Route component</div>}
          path="/profile"
        />
      </KeycloakProvider>
    );
    await waitFor(() => expect(keycloakInstance.login).toBeCalledTimes(1));
    expect(keycloakInstance.login).toBeCalledWith({
      idpHint: "ei",
      scope: "phone",
    });
    const loading = await screen.findByText("...loading");
    expect(loading).toBeInTheDocument();
  });

  it("should render reach-router route component correctly", async () => {
    keycloakInstance.init.mockClear();
    render(
      <KeycloakProvider
        //@ts-ignore
        keycloak={keycloakInstance}
        loginOptions={loginOptions}
        loadingComponent={<div>...loading</div>}
        isAuthenticated
      >
        <Router>
          <ProtectedRoute RouteComponent={ReachRouterPage} path="/" />
        </Router>
      </KeycloakProvider>
    );
    expect(keycloakInstance.init).not.toBeCalled();
    const RouteComponent = await screen.findByText("Home");
    expect(RouteComponent).toBeInTheDocument();
  });

  it("should render react-router-dom route component correctly", async () => {
    keycloakInstance.init.mockClear();
    render(
      <KeycloakProvider
        //@ts-ignore
        keycloak={keycloakInstance}
        loginOptions={loginOptions}
        loadingComponent={<div>...loading</div>}
        isAuthenticated
      >
        <MemoryRouter>
          <ProtectedRoute
            RouteComponent={Route}
            ComponentToRender={ReactRouterPage}
            path="/"
          />
        </MemoryRouter>
      </KeycloakProvider>
    );
    expect(keycloakInstance.init).not.toBeCalled();
    const RouteComponent = await screen.findByText("Profile page :D");
    expect(RouteComponent).toBeInTheDocument();
  });


  it("should throw an error if the loading component is missing", async () => {   
    try {
      render(
        <KeycloakProvider
          //@ts-ignore
          keycloak={keycloakInstance}
        >
          <ProtectedRoute
            RouteComponent={() => <div>Route component</div>}
            path="/profile"
          />
        </KeycloakProvider>
      );
    } catch (error) {
      expect(error.message).toEqual("You must provide the loadingComponent props to the KeycloakProvider when using the ProtectedRoute");
    }
  });
});
