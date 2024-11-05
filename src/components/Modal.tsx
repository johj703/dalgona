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
        <div>{mainText}</div>
        {subText && <div>{subText}</div>}

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
          <button onClick={() => clickCancelButton()}>확인</button>
        )}
      </div>
    </>
  );
};
export default Modal;
