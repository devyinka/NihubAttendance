import style from "./forminput.module.css"
 const Input = ({ type, label, value, setValue }) => {
  return (
    <div className={style.container}>
      <label className={style.title}>{label}</label>
      <div className={style.inputsubtitle}>
        <input
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={(event) =>setValue(event.target.value)}
          
        />
      </div>
    </div>
  );
};

export default Input;