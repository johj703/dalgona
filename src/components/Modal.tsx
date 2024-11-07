import { booleanState } from "@/types/Canvas";

type ModalProps = {
  mainText: string;
  subText?: string;
  isConfirm?: boolean;
  setModalState: booleanState;
  confirmAction?: () => Promise<void>;
};
const Modal = ({ mainText, subText, isConfirm, setModalState, confirmAction }: ModalProps) => {
  const clickConfirmButton = async () => {
    setModalState(false);
    if (confirmAction) await confirmAction();
  };

  const clickCancelButton = () => {
    setModalState(false);
  };

  return (
    <>
      <div className="fixed top-0 bottom-0 right-0 left-0 bg-black opacity-70"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] bg-white rounded-lg">
        <div className="flex flex-col items-center gap-2 text-center p-4">
          <div>{mainText}</div>
          {subText && <div>{subText}</div>}
        </div>

        {isConfirm ? (
          <div className="flex justify-center gap-4 py-5">
            <button className="button-144-48" onClick={() => clickCancelButton()}>
              아니오
            </button>
            <button className="button-144-48" onClick={() => clickConfirmButton()}>
              네
            </button>
          </div>
        ) : (
          <div className="py-[14.5px] px-6">
            <button className="w-full text-lg leading-[1.35]" onClick={() => clickCancelButton()}>
              확인
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default Modal;
