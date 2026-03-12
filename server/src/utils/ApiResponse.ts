export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'Success') {
    return new ApiResponse<T>(true, message, data);
  }

  static created<T>(data: T, message = 'Created successfully') {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string) {
    return new ApiResponse(false, message, null);
  }
}
