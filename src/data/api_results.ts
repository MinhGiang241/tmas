export interface APIResults {
  code?: number;
  isPopup?: boolean;
  message?: string;
  data: any;
  records?: number;
  messageType?: ApiMessageType;
}

export interface APIResultsBC {
  code?: number;
  isPopup?: boolean;
  message?: string;
  data: any;
  records?: number;
}

export enum ApiMessageType {
  None = "none",
  Success = "success",
  Warning = "warning",
  Danger = "danger",
}
