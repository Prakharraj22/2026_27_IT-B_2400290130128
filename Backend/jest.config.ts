import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@profiles/(.*)$': '<rootDir>/src/profiles/$1',
    '^@matching/(.*)$': '<rootDir>/src/matching/$1',
    '^@market-intel/(.*)$': '<rootDir>/src/market-intel/$1',
  },
};

export default config;
