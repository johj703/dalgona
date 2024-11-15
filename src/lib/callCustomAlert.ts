type AlertInfo = { type: string; text: string; position: string };

const callCustomAlert = (
  customAlert: AlertInfo | null,
  setCustomAlert: React.Dispatch<React.SetStateAction<AlertInfo | null>>,
  alertInfo: AlertInfo
) => {
  if (!customAlert) {
    setCustomAlert(alertInfo);

    setTimeout(() => {
      setCustomAlert(null);
    }, 3000);
  }
};
export default callCustomAlert;
