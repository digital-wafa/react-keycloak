import React, { ReactChild, createContext, useState, useContext } from "react";
import { KeycloakInitOptions, KeycloakInstance, KeycloakLoginOptions } from "keycloak-js";
import {
  AuthLogoutHandler,
  AuthRefreshErrorHandler,
  AuthRefreshSuccessHandler,
  AuthSuccessHandler,
  TokenExpiredHandler,
} from "./keycloakEventsHandlers";

interface KeycloakContextType {
  keycloak: KeycloakInstance;
  loginOptions: KeycloakLoginOptions;
  initOptions: KeycloakInitOptions;
  authenticated: boolean;
  setAuthenticated: Function;
  loadingComponent: any;
}

interface KeycloakProviderProps {
  /**
   * Keycloak instance
   */
  keycloak: KeycloakInstance;
  /**
   * keycloak login options
   */
  loginOptions?: KeycloakLoginOptions;
  /**
   * keycloak init options
   */
  initOptions?: KeycloakInitOptions;
  children: ReactChild;
  /**
   * the loading component to show while keyclaok is initializing
   */
  loadingComponent?: any;
  /**
   * just for testing purpose
   */
  isAuthenticated?: boolean
}

export const keycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
);

keycloakContext.displayName = "keycloakContext";

export const useKeycloakContext = (): KeycloakContextType => {
  const context = useContext(keycloakContext);
  if (!context) throw new Error("you must use the KeycloakProvider");
  return context;
};

export const KeycloakProvider = ({
  keycloak,
  loginOptions,
  initOptions,
  loadingComponent,
  children,
  isAuthenticated = false
}: KeycloakProviderProps) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);


  const value = {
    keycloak,
    loginOptions,
    initOptions : {
      promiseType : "native", // just to support old version of keycloak. the new versions of keycloak adapter use the native promise by default
      checkLoginIframe: false,  // fix logout bug in keycloak v6
      ...initOptions
    },
    loadingComponent,
    authenticated,
    setAuthenticated,
  };

  keycloak.onAuthSuccess = AuthSuccessHandler(keycloak, setAuthenticated);

  keycloak.onAuthRefreshSuccess = AuthRefreshSuccessHandler(keycloak);

  keycloak.onTokenExpired = TokenExpiredHandler(keycloak);

  keycloak.onAuthRefreshError = AuthRefreshErrorHandler(keycloak, loginOptions);

  keycloak.onAuthLogout = AuthLogoutHandler;

  return (
    <keycloakContext.Provider value={value}>
      {children}
    </keycloakContext.Provider>
  );
};
