import { callApi } from "./base_api";

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
