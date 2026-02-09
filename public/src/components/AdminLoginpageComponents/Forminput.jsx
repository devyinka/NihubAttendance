const Input = ({ type, label, value, setValue }) => {
  return (
    <div>
      <label className="text-[#7741C3] font-mono text-[90%] font-normal mt-2 mb-1 pl-5">
        {label}
      </label>
      <div className="text-[#717182] font-mono text-[70%] rounded-md border border-transparent bg-[#F3F3F5] w-[90%] ml-5 mr-5 p-2 mb-2">
        <input
          type={`${type}`}
          placeholder={`Enter your ${label.toLowerCase()}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
