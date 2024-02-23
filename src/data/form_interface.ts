export interface RegisterFormValues {
  full_name?: string;
  company_name?: string;
  phone?: string;
  register_email?: string;
  register_password?: string;
  re_password?: string;
  invitationId?: string;
}

export interface RegisterFormData {
  full_name?: string;
  company?: string;
  phone?: string;
  email?: string;
  password?: string;
  sso_token?: string;
  reg_type?: string;
  captcha_token?: string;
  invitationId?: string;
}

export interface LoginFormValue {
  email?: string;
  password?: string;
}

export interface LoginFormData {
  email?: string;
  password?: string;
  captcha_token?: string;
  log_type?: string;
  sso_token?: string;
}

export interface StudioFormData {
  studio_name?: string;
  stu_banner?: string;
  stu_btn_color?: string;
  stu_text_color?: string;
  stu_logo?: string;
}
