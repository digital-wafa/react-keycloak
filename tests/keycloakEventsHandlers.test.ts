import {
  AuthLogoutHandler,
  AuthRefreshErrorHandler,
  AuthRefreshSuccessHandler,
  AuthSuccessHandler,
  TokenExpiredHandler,
} from "../src/keycloakEventsHandlers";
import { setToken, clearToken } from "../src/authentification";

jest.mock("../src/authentification", () => {
  return {
    setToken: jest.fn(),
    clearToken: jest.fn(),
  };
});

const keycloakInstance = {
  token: "token",
  refreshToken: "refresh token",
  updateToken: jest.fn(),
  login: jest.fn(),
};

const setAuthenticated = jest.fn();
describe("keycloak events handlers", () => {
  it("should set the authenticated flag to true and save the token to localstorage", () => {
    //@ts-ignore
    AuthSuccessHandler(keycloakInstance, setAuthenticated)();
    expect(setAuthenticated).toBeCalledTimes(1);
    expect(setToken).toBeCalledTimes(1);
    expect(setToken).toBeCalledWith("token", "refresh token");
  });

  it("should save the new token to localstorage when the refresh token request succed", () => {
    //@ts-ignore
    setToken.mockClear();
    //@ts-ignore
    AuthRefreshSuccessHandler(keycloakInstance)();
    expect(setToken).toBeCalledTimes(1);
    expect(setToken).toBeCalledWith("token", "refresh token");
  });

  it("should call the updateToken when the token has been expired", () => {
    //@ts-ignore
    TokenExpiredHandler(keycloakInstance)();
    expect(keycloakInstance.updateToken).toBeCalledTimes(1);
    expect(keycloakInstance.updateToken).toBeCalledWith(1);
  });

  it("should call login if the refresh request failed", () => {
    const loginOptions = {
      idpHint: "ei",
    };
    //@ts-ignore
    AuthRefreshErrorHandler(keycloakInstance, loginOptions)();
    expect(keycloakInstance.login).toBeCalledTimes(1);
    expect(keycloakInstance.login).toBeCalledWith(loginOptions);
  });

  it("should clear the token in the local storage on logout", () => {
    AuthLogoutHandler();
    expect(clearToken).toBeCalledTimes(1);
  });
});
