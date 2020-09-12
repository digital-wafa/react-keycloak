import React from "react";
import { render } from "@testing-library/react";
import { useKeycloakContext } from "../src/keycloakContext";

const ComponentWithoutProvider = () => {
  useKeycloakContext();
  return <div>im a component rendered without provider</div>;
};

describe("keyloakContext", () => {
  it("should throw an error if the keycloak context is used outside the provider", () => {
    try {
      render(<ComponentWithoutProvider />);
    } catch (error) {
      expect(error.message).toEqual("you must use the KeycloakProvider");
    }
  });
});
