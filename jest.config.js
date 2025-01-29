const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Proporciona la ruta a tu configuración de Next.js
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Mapea estilos y archivos estáticos
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Configuración adicional para Jest
};

module.exports = createJestConfig(customJestConfig);
