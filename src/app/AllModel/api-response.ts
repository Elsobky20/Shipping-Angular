export interface APIResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
  error?: string;
}
