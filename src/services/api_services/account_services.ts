import { UserData } from "@/data/user";
import { callApi } from "./base_api";
import { StudioFormData, CheckDiscountParams } from "@/data/form_interface";
import { APIResults } from "@/data/api_results";

export const changeStudio = async (ownerId?: string) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.me`,
    { ownerId },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const getMemberListInStudio = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/userstudio.list_member`,
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const sendInviteEmailToMember = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.send_invite`,
    { email, role },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const checkEmailToWorkSpace = async ({ email }: { email: string }) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.check_invite_member`,
    { email },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const deleteMemberFromWorkSpace = async ({
  userId,
}: {
  userId?: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/userstudio.remove_member`,
    { userId },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};
export const deleteInvitedMemberFromWorkSpace = async ({
  email,
}: {
  email?: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/studioinvitation.remove`,
    { email },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const getInvitaionEmailMember = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/studioinvitation.load`,
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const updateRoleMember = async ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/userstudio.update_role`,
    { userId, role },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const updatePersonalInfo = async (data: Object) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.update_info`,
    { data },
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const uploadFile = async (data: any) => {
  var results = await callApi.upload(
    `${process.env.NEXT_PUBLIC_API_BC}/headless/stream/upload`,
    data,
  );
  if (results.code === 0) {
    return results.data;
  }
};

// https://api.tmas.demego.vn/apimodel/user.update_studio
export const updateStudioInfo = async (data: StudioFormData) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.update_studio`,
    data,
  );
  if (results?.code != 0) {
    throw results?.message ?? "";
  }
  return results.data;
};

export const loadGoldList = async (data: { skip?: number; limit?: number }) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldsetting.getGoldList`,
    data,
  );

  return results;
};

export const loadHistoryGold = async (data: {
  skip?: number;
  limit?: number;
  text?: string;
  fromDate?: string;
  toDate?: string;
  changed?: string;
  payment_status?: string;
}) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/goldtransaction.get_by_account`,
    data,
  );

  return results;
};
// https://api.tmas.demego.vn/apimodel/billtransaction.create_online_transaction
export const makePayment = async (data: {
  product_type?: "Package" | "Gold";
  goldId?: string;
  packageId?: string;
}) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/billtransaction.create_online_transaction`,
    data,
  );

  return results;
};

export const loadHistoryUpgrade = async (data: {
  skip?: number;
  limit?: number;
}) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/licence.get_by_account`,
    data,
  );

  return results;
};
export const loadConfig = async () => {
  var results: APIResults = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/studiosetting.load`,
  );

  return results;
};

export const loadResultTransaction = async (vnp_TxnRef?: string) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/vnpay.get_payment_result`,
    {
      vnp_TxnRef,
    },
  );

  return results;
};

export const userDeleteAccount = async () => {
  var results: APIResults = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.delete_self_account`,
  );

  return results;
};

export const checkDistcountCode = async (data: CheckDiscountParams) => {
  var results: APIResults = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/billtransaction.check_discount_code`,
    data,
  );

  return results;
};
