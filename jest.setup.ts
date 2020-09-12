import '@testing-library/jest-dom/extend-expect'

Storage.prototype.setItem = jest.fn();
Storage.prototype.getItem = jest.fn();
Storage.prototype.removeItem = jest.fn();