class ApiError extends Error {
  status_code: number | null = null;
  error_code: string | null = null;

  constructor(message: string, error_code: string, status_code: number) {
    super(message);

    this.status_code = status_code;
    this.error_code = error_code;
  }
}

export default ApiError;
