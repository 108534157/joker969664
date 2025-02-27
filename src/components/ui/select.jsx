import React from "react";

export function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} className="bg-gray-700 text-white p-2 rounded">
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
