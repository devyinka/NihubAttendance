const DescribeInput = ({ type, label, value, setValue }) => {
  return (
    <div>
      <label className="text-[#7741c3] font-medium font-mono text-sm pl-2 mb-1">
        {label}
      </label>
      <div className="text-[#717182] font-family-mono text-sm text-bold  pb-3 ml-2.5 mr-8 mb-2 rounded-md border border-transparent bg-[#f3f3f5] w-[95%]">
        <input
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
