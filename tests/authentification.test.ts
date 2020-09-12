import {
  clearToken,
  setToken,
  getRefreshToken,
  getToken,
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
} from "../src/authentification";


describe("authentification", () => {
  it("set the token to local storage", () => {
    setToken("token", "refresh token");
    expect(localStorage.setItem).toBeCalledTimes(2);
    expect(localStorage.setItem).toBeCalledWith(TOKEN_KEY, "token");
    expect(localStorage.setItem).toBeCalledWith(
      REFRESH_TOKEN_KEY,
      "refresh token"
    );
  });

  it("get the token from local storage", () => {
    getToken();
    expect(localStorage.getItem).toBeCalledTimes(1);
    expect(localStorage.getItem).toBeCalledWith(TOKEN_KEY);
  });

  it("get the refresh token from local storage", () => {
    //@ts-ignore
    Storage.prototype.getItem.mockClear();
    getRefreshToken();
    expect(localStorage.getItem).toBeCalledTimes(1);
    expect(localStorage.getItem).toBeCalledWith(REFRESH_TOKEN_KEY);
  });

  it("should remove the tokens from local storage", () => {
    clearToken();
    expect(localStorage.removeItem).toBeCalledTimes(2);
    expect(localStorage.removeItem).toBeCalledWith(TOKEN_KEY);
    expect(localStorage.removeItem).toBeCalledWith(REFRESH_TOKEN_KEY);
  });
});
