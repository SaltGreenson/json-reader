export interface IError extends Error {
  status_code: number;
  error_code: string | number;
  fields?: { [key: string]: unknown };
}
