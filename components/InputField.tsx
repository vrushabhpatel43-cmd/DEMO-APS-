import React from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
};

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors h-[50px]"
    />
  </div>
);