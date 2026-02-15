const Search = ({ type, label, value, setValue }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[#7741C3] font-mono text-xs sm:text-[10px] mt-2 mb-1">
        {label}
      </label>
      <div className="bg-gray-100 border border-gray-300 rounded px-2 py-1 w-full">
        <input
          type={type}
          placeholder="matric number..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="border-0 outline-none w-full text-xs text-gray-700 bg-transparent"
        />
      </div>
    </div>
  );
};

export default Search;
