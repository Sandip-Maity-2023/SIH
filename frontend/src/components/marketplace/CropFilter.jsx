import React from 'react';

const CropFilter = ({ searchTerm, setSearchTerm, selectedGrade, setSelectedGrade, organicOnly, setOrganicOnly }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
      <input
        type="text"
        placeholder="Search crop type or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white outline-none"
        >
          <option value="">All AI Quality Grades</option>
          <option value="A">Grade A (Export Quality)</option>
          <option value="B">Grade B (Domestic Market)</option>
          <option value="C">Grade C (Processing Industry)</option>
        </select>

        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
            className="accent-emerald-600 rounded"
          />
          Organic Certified
        </label>
      </div>
    </div>
  );
};

export default CropFilter;
