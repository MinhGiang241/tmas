import { callApi } from "./base_api";

export const changeStudio = async (ownerId?: string) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.me`,
    { ownerId },
  );
  return results;
};

export const getMemberListInStudio = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/userstudio.list_member`,
  );
  return results;
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
  return results;
};

export const checkEmailToWorkSpace = async ({ email }: { email: string }) => {
  var results = await callApi.post(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/user.check_invite_member`,
    { email },
  );
  return results;
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
  return results;
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
  return results;
};

export const getInvitaionEmailMember = async () => {
  var results = await callApi.get(
    `${process.env.NEXT_PUBLIC_API_BC}/apimodel/studioinvitation.load`,
  );
  return results;
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
  return results;
};
