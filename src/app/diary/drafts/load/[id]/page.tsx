"use client";

import Form from "@/components/diary/Form";
import { useGetDraft } from "@/queries/drafts/useGetDraft";

const Load = ({ params }: { params: { id: string } }) => {
  const { data: diary, isLoading, isError } = useGetDraft(params.id);
  if (isLoading) return;
  if (isError) return;

  return <Form POST_ID={params.id} initialData={diary} />;
};
export default Load;
