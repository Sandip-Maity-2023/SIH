import React from 'react';

const AccountTypeSelector = ({ selectedType, onSelect }) => {
  const accountTypes = [
    {
      id: 'farmer',
      title: 'Farmer / FPO',
      description: 'List produce directly, access DoCA market rates, and connect with verified buyers.',
      badge: 'Seller'
    },
    {
      id: 'buyer',
      title: 'Buyer / Wholesaler',
      description: 'Procure agricultural commodities directly from farms with escrow protection.',
      badge: 'Buyer'
    },
    {
      id: 'logistics',
      title: 'Logistics Partner',
      description: 'Offer freight and cold-chain transportation services for agricultural trade.',
      badge: 'Transporter'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Select Account Type</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Choose how you plan to participate in the agricultural marketplace.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accountTypes.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`cursor-pointer rounded-lg border p-4 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-600'
                  : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {type.badge}
                  </span>
                  <input
                    type="radio"
                    name="accountType"
                    checked={isSelected}
                    onChange={() => onSelect(type.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-1">{type.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{type.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountTypeSelector;