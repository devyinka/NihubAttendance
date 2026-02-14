const DescribeInput = ({ type, label, value, setValue }) => {
  return (
    <div className="w-full">
      <label className="text-[#7741c3] font-medium font-mono text-sm mb-1">
        {label}
      </label>
      <div className="text-[#717182] font-family-mono text-sm text-bold pb-3 mb-2 rounded-md border border-transparent bg-[#f3f3f5] w-full px-2 py-2">
        <input
          className="w-full bg-transparent outline-none"
          type={type}
          placeholder="Describe the Event"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  );
};

export default DescribeInput;
