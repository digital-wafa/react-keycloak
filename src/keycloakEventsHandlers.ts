import Logger from "@digital-wafa/logger";
import { setToken, clearToken } from "./authentification";
import { KeycloakInstance, KeycloakLoginOptions } from "keycloak-js";

export const AuthSuccessHandler = (
  keycloak: KeycloakInstance,
  setAuthenticated: Function
) => () => {
  Logger.log(
    Logger.Level.INFO,
    "%cauthenticated",
    "color: yellow; font-weight: bold;"
  );
  setAuthenticated(true);
  setToken(keycloak.token, keycloak.refreshToken);
};

export const AuthRefreshSuccessHandler = (keycloak: KeycloakInstance) => () => {
  Logger.log(
    Logger.Level.INFO,
    "%ctoken refreshed",
    "color: yellow; font-weight: bold;"
  );
  setToken(keycloak.token, keycloak.refreshToken);
};

export const TokenExpiredHandler = (keycloak: KeycloakInstance) => async () => {
  Logger.log(
    Logger.Level.INFO,
    "%ctoken expired",
    "color: yellow; font-weight: bold;"
  );
  await keycloak.updateToken(1);
};

export const AuthRefreshErrorHandler = (
  keycloak: KeycloakInstance,
  loginOptions: KeycloakLoginOptions
) => () => {
  Logger.log(
    Logger.Level.INFO,
    "%ctoken not refreshed",
    "color: yellow; font-weight: bold;"
  );
  keycloak.login(loginOptions);
};

export const AuthLogoutHandler = () => {
  Logger.log(
    Logger.Level.INFO,
    "%clogout",
    "color: yellow; font-weight: bold;"
  );
  clearToken();
};
