export interface ListNotification {
  unAwared?: Array<{
    _id?: string;
    createdTime?: string;
    subject?: string;
    body?: string;
    url?: string;
    read?: string;
    stu_logo?: string;
    imageLink?: string;
    type?: string;
    timeJoined?: string;
    timeJoinedUnit?: string;
    senderId?: string;
    allowNotifications?: boolean;
  }>;
  awared?: Array<{
    _id?: string;
    createdTime?: string;
    subject?: string;
    body?: string;
    url?: string;
    read?: string;
    stu_logo?: string;
    imageLink?: string;
    type?: string;
    timeJoined?: string;
    timeJoinedUnit?: string;
    senderId?: string;
    allowNotifications?: boolean;
  }>;
}
