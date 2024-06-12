export interface OverviewNumberData {
  totalDoingTest?: number;
  totalTest?: number;
  totalTestToday?: number;
  totalTestTomorrow?: number;
  totalUserTest?: number;
  totalUserTestToday?: number;
  totalUserTestTomorrow?: number;
}

export enum TimeChart {
  Week = "week",
  Month = "month",
  Day = "day",
  Year = "year",
}

export interface ActivitiesParams {
  startTime?: string;
  endTime?: string;
  typeTime?: TimeChart;
  lang?: string;
}

export interface TimeOnChartData {
  day?: number;
  month?: number;
  year?: number;
  total?: number;
}
