import style from "./Searchinput.module.css"
const Search = ({ type, label, value, setValue }) => {
    
  return (
    <div className={style.container}>
      <label className={style.title}>{label}</label>
      <div className={style.inputsubtitle}>
        <input
          type={type}
          placeholder=" matric number..."
          value={value}
          onChange={(event) =>setValue(event.target.value)}
          
        />
      </div>
    </div>
  );
};

export default Search;