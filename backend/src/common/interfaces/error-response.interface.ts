export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  method: string;
  timestamp: string;
}
