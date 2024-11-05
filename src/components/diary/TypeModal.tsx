import { FormData, FormState, stringState } from "@/types/Canvas";

type TypeModalProps = {
  formData: FormData;
  setFormData: FormState;
  setOpenTypeModal: stringState;
  openTypeModal: string;
};

export const TypeModal = ({ formData, setFormData, setOpenTypeModal, openTypeModal }: TypeModalProps) => {
  const clickSelectButton = () => {
    setFormData({ ...formData, type: openTypeModal });
    setOpenTypeModal("");
  };

  return (
    <>
      <div className="fixed top-0 bottom-0 right-0 left-0 bg-black opacity-70"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] bg-white rounded-lg">
        {openTypeModal === "모눈종이" ? (
          <img src="/images/type-preview-1.svg" alt="모눈종이" />
        ) : (
          <img src="/images/type-preview-2.svg" alt="줄노트" />
        )}

        <div className="flex justify-center gap-4 py-5">
          <button className="button-144-48" onClick={() => setOpenTypeModal("")}>
            뒤로가기
          </button>
          <button className="button-144-48" onClick={() => clickSelectButton()}>
            선택
          </button>
        </div>
      </div>
    </>
  );
};
