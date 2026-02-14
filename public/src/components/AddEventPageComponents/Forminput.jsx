import style from "./Forminput.module.css";

const Input = ({ type, label, value, setValue }) => {
  return (
    <div className="flex-1">
      <label className="text-[#7741c3] font-medium font-mono text-sm">
        {label}
      </label>
      <div className="text-[#717182] font-mono text-1rem rounded-md border border-transparent bg-[#f3f3f5] ">
        <input
          type={type}
          value={value}
          placeholder={`Enter ${label.toLowerCase()}`}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
