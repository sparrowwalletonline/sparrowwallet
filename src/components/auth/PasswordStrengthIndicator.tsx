
import React from 'react';

interface PasswordStrengthProps {
  password: string;
  strength: number;
  feedback: string;
}

export const checkPasswordStrength = (password: string) => {
  let strength = 0;
  let feedback = '';

  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  switch (strength) {
    case 0:
      feedback = 'Sehr schwach';
      break;
    case 1:
      feedback = 'Schwach';
      break;
    case 2:
      feedback = 'Moderat';
      break;
    case 3:
      feedback = 'Stark';
      break;
    case 4:
      feedback = 'Sehr stark';
      break;
  }

  return { strength, feedback };
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password, strength, feedback }) => {
  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      case 4:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300`} 
          style={{ width: `${(strength / 4) * 100}%` }} 
        />
      </div>
      <p className="text-xs text-gray-600">{feedback}</p>
    </div>
  );
};

export default PasswordStrengthIndicator;
