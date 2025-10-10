import React from 'react';

export default function StatCard({ number, description, borderColor }) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-xl text-center border-4 ${borderColor}`}>
      <div className={`text-5xl font-bold mb-2 ${borderColor.replace('border-', 'text-')}`}>
        {number}
      </div>
      <p className="text-gray-700 text-lg font-semibold">
        {description}
      </p>
    </div>
  );
}