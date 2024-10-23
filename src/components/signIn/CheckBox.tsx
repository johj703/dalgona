export default function CheckBox() {
  return (
    <label>
      <input id={id} type="checkbox" checked={bChecked} onChange={(e) => checkHandle(e)} />
    </label>
  );
}
