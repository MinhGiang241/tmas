export interface UserData {
  _id?: string;
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
  schema?: string;
  type?: string;
  name?: string;
  desc?: string;
  duration?: number;
  unit?: string;
  custom_price?: number;
  activate?: boolean;
  max_user?: number;
}

export interface Studio {
  _id?: string;
  studio_name?: string;
  accountType?: string;
  avatar?: string;
  createdTime?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role?: string;
  ssoid?: string;
  verified?: boolean;
}

export interface Studios {
  _id: string;
  createdTime?: string;
  ownerId?: string;
  role?: string;
  studio_name: string;
  userId?: string;
}
