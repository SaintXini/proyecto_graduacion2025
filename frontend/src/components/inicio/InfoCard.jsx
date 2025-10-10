import React from 'react';

export default function InfoCard({ icon: Icon, title, items, borderColor, iconColor }) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg border-l-8 ${borderColor}`}>
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        <Icon className={`${iconColor} w-8 h-8`} />
        {title}
      </h3>
      <ul className="space-y-3 text-gray-700 text-lg">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}