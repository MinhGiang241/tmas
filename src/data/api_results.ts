export interface APIResults {
  code?: number;
  isPopup?: boolean;
  message?: string;
  data: any;
}

export interface APIResultsBC {
  code?: number;
  isPopup?: boolean;
  message?: string;
  data: any;
  records?: number;
}
