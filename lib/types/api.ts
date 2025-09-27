export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  errors: string[];
}

// Common API error type
export class ApiError extends Error {
  public errors: string[];
  public status?: number;

  constructor(errors: string[], status?: number) {
    super(errors.join(", "));
    this.name = "ApiError";
    this.errors = errors;
    this.status = status;
  }
}
