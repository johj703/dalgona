import browserClient from "@/utils/supabase/client";

export const getLoginUser = async () => {
  const { data, error } = await browserClient.auth.getSession();

  if (error) return console.error("getLoginUser =>", error);

  if (data.session === null) {
    const { data } = await browserClient.auth.refreshSession();
    const { user } = data;
    return user;
  }

  const {
    data: { user }
  } = await browserClient.auth.getUser();

  return user;
};
