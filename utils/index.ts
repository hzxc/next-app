export * from './http';

export const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
