import App from './App';

// Mock localStorage para evitar errores en tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

test('app component exists', () => {
  expect(App).toBeDefined();
});

test('app component is a function', () => {
  expect(typeof App).toBe('function');
});

test('app component can be imported', () => {
  expect(App).not.toBeNull();
  expect(App).not.toBeUndefined();
});
