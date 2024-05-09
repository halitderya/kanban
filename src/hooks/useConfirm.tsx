import { useState } from "react";

interface PromiseState {
  resolve: (value: boolean) => void;
}

const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<PromiseState | null>(null);
  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = (): void => {
    setPromise(null);
  };

  const handleConfirm = (): void => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = (): void => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = (): JSX.Element => (
    <div className="addlanemodal flex flex-col gap-4 ">
      <div className="w-full justify-around ">
        <div className=" font-bold text-lg">{title}</div>
      </div>
      <p>{message}</p>
      <div className="w-full flex justify-between center">
        <button className="settings-button w-1/3" onClick={handleConfirm}>
          Yes
        </button>
        <button className="settings-button w-1/3 " onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );

  return [ConfirmationDialog, confirm];
};

export default useConfirm;
