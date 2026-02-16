const Input = ({ type, label, value, setValue }) => {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[#7741c3] text-xs font-semibold mt-[2%] mb-[1%] pl-[2%]">
        {label}
      </label>
      <div className="text-[#717182] text-xs pt-1 pb-0.5 pl-2 mb-2 rounded border border-transparent bg-[#F3F3F5] ml-0.5 w-[96%]">
        <input
          type={type}
          placeholder={`${label.toLowerCase()}`}
          value={value ?? ""}
          onChange={(event) => setValue && setValue(event.target.value)}
          className="bg-transparent w-full outline-none px-2 py-1 text-[#0A0A0A] placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default Input;
