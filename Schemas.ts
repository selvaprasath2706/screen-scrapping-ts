import FormData from "form-data";

export interface FailureResponse {
  status: string;
  error: string;
}
export interface PdfResult {
  title: string;
  href: string;
}
export interface SuccessfulResponse {
  status?: string;
}

export interface requestConfig {
  method: string;
  maxBodyLength: number;
  url: string;
  headers: {
    "Content-Type": string;
  };
  data: FormData;
}
