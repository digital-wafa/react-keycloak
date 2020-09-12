import React from "react";
import { render, screen } from "@testing-library/react";
import { KeycloakProvider } from "../src/keycloakContext";
import ProtectedRoute from "../src/protectedRoute";
import { MemoryRouter, Route } from "react-router-dom";
import { Router } from "@reach/router";

const keycloakInstance = {
  token: "token",
  refreshToken: "refresh token",
  init: jest.fn().mockResolvedValueOnce(true),
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
  it("should init keycloak", async () => {
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
    expect(keycloakInstance.init).toBeCalledTimes(1);
    const loading = await screen.findByText("...loading");
    expect(loading).toBeInTheDocument();
  });

  it("should call the login method", async () => {
    keycloakInstance.init.mockReturnValue({
      then: (cb: Function) => {
        cb(false);
      },
    });
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
    expect(keycloakInstance.login).toBeCalledTimes(1);
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
});
