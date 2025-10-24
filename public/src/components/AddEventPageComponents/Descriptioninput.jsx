import style from "./Descriptioninput.module.css"
 const DescribeInput= ({ type,label, value, setValue }) => {
  return (
    <div>
      <label className={style.title}>{label}</label>
      <div className={style.inputsubtitle}>
        <input
          type={type}
          placeholder="Describe the Event"
          value={value}
          onChange={(event) =>setValue(event.target.value)}
      
        />
      </div>
    </div>
  );
};

export default  DescribeInput;
 
 
 
 