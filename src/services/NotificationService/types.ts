import { LanguageCodeEnum } from "../../enums/LanguageCodeEnum";

export interface RegisterNotificationRequest {
  DeviceId?: string;
  FCMToken: string;
  PartnerCode?: string;
  Platform?: number;
  UserAgent?: string;
  DeviceName?: string;
}

export interface GetNotificationRequest {
  PartnerCode: string;
  ProjectCode: string;
  Language: LanguageCodeEnum;
  PageNumber?: number;
  PageSize?: number;
}

export interface NotificationResponse {
  Id: string;
  Content: string;
  Details: string;
  Icon: string | null;
  Link: string;
  Type: number;
  IsReaded: boolean;
  CreatedDate: number;
  ModifiedDate: number | null;
  PartnerCode: string;
  ProjectCode: string;
  RefId: string | null;
}

export interface PaginatedNotificationResponse {
  IsNext: boolean;
  IsPrevious: boolean;
  TotalRecords: number;
}

export interface MarkAsReadRequest {
  Id: string;
  PartnerCode: string;
}

export type DeleteNotificationRequest = MarkAsReadRequest;
