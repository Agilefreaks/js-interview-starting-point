const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^#(.*)$': '<rootDir>/src/$1',
  },
}

export default config
