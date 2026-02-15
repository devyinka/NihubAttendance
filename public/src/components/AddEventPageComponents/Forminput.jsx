const Input = ({ type, label, value, setValue }) => {
  return (
    <div className="flex-1 w-full">
      <label className="text-[#7741c3] font-medium font-mono text-sm">
        {label}
      </label>
      <div className="text-[#717182] font-mono text-1rem rounded-md border border-transparent bg-[#f3f3f5] px-2 py-2 mt-1">
        <input
          className="w-full bg-transparent outline-none"
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
