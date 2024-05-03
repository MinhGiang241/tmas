export interface UserData {
  _id?: string;
  gold?: number;
  accountType?: string;
  avatar?: string;
  createdTime?: string;
  updatedTime?: string;
  email?: string;
  schema?: string;
  full_name?: string;
  isActive?: boolean;
  isRoot?: boolean;
  role?: string;
  ssoid?: string;
  studio?: Studio;
  studios?: Studios[];
  userName?: string;
  verified?: boolean;
  lang?: string;
  licence?: Licence;
  licences?: {
    individual?: Package;
    enterprise?: Package;
  };
  userId?: string;
  phone_number?: string;
  phone?: string;
  account?: string;
  stu_btn_color?: string;
  stu_text_color?: string;
  studio_name?: string;
  stu_logo?: string;
  stu_banner?: string;
  isInvite?: boolean;
}

export interface Licence {
  _id?: string;
  key?: string;
  userId?: string;
  price?: number;
  actived?: boolean;
  packageId?: string;
  active_date?: string;
  expire_date?: string;
  pkg_name?: string;
  pkg_type?: string;
  payment_state?: string;
  schema?: string;
  package?: Package;
}

export interface Package {
  _id?: string;
  key?: string;
  packageId?: string;
  userId?: string;
  createdTime?: string;
  actived?: boolean;
  max_user?: number;
  active_date?: string;
  expire_date?: string;
  nonstop?: boolean;
  payment_state?: boolean;
  pkg_code?: string;
  pkg_name?: string;
  pkg_type?: string;
  price?: number;
  today?: string;
  transactionId?: string;
}

export interface Studio {
  _id?: string;

  accountType?: string;
  avatar?: string;
  createdTime?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role?: string;
  ssoid?: string;
  verified?: boolean;
  stu_btn_color?: string;
  stu_text_color?: string;
  studio_name?: string;
  stu_logo?: string;
  stu_banner?: string;
}

export interface Studios {
  _id: string;
  createdTime?: string;
  ownerId?: string;
  role?: string;
  studio_name: string;
  userId?: string;
}

export interface GoldData {
  _id?: string;
  createdTime?: string;
  updatedTime?: string;
  cost?: number;
  creator?: string;
  gold?: number;
  name?: string;
  status?: boolean;
  schema?: string;
  updater?: string;
  version_number?: number;
}

export interface GoldHistoryData {
  _id?: string;
  createdTime?: string;
  updatedTime?: string;
  bill_amount?: number;
  code?: string;
  creator?: string;
  email?: string;
  goldId?: string;
  gold_changed?: number;
  goldsetting?: { _id?: string; gold?: number };
  message?: string;
  payment_method?: string;
  payment_status?: "Completed" | "Pending" | "Terminated";
  product_type?: "Gold" | "Package";
  receipt_amount?: number;
  total_amount?: number;
  userId?: string;
}

export interface LicenceData {
  _id?: string;
  createdTime?: string;
  updatedTime?: string;
  active_date?: string;
  actived?: boolean;
  expire_date?: string;
  key?: string;
  max_user?: number;
  nonstop?: boolean;
  packageId?: string;
  payment_state?: boolean;
  pkg_code?: string;
  pkg_name?: string;
  pkg_type?: string;
  price?: number;
  custom_price?: boolean;
  userId?: boolean;
  version_number?: number;
}

export interface SettingData {
  _id?: string;
  createdTime?: string;
  updatedTime?: string;
  fraud?: {
    anti_copy?: boolean;
    anti_paste?: boolean;
    exist_screen?: boolean;
    full_screen?: boolean;
  };
  package?: {
    def_ent_id?: string;
    def_ind_id?: string;
    enable_trial_ent?: boolean;
    enable_trial_ind?: boolean;
    trial_ent_day?: number;
    trial_ent_id?: string;
    trial_ind_day?: number;
    trial_ind_id?: string;
  };
  send_method?: {
    email?: boolean;
    sms?: boolean;
  };
  schema?: string;
  tmas_info?: {
    address?: string;
    business?: string;
    email?: string;
    phone?: string;
  };
  payment?: {
    bank?: boolean;
    momo?: boolean;
    visa?: boolean;
    vnpay?: boolean;
  };
}

export interface TransactionData {
  bill_amount?: number;
  code?: string;
  createdTime?: string;
  creator?: string;
  email?: string;
  gold?: number;
  goldId?: string;
  message?: string;
  payment_method?: string;
  payment_status?: string;
  product_type?: "Gold" | "Package";
  receipt_amount?: number;
  schema?: string;
  updatedTime?: string;
  userId?: string;
  version_number?: number;
  _id?: string;
}
