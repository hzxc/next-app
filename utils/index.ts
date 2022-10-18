export * from './http';

export const toNumber = (value: unknown) =>
  isNaN(Number(value)) ? 0 : Number(value);

export const isError = (value: any): value is Error => value?.message;
