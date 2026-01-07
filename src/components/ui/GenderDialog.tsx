import React from 'react';

interface GenderDialogProps {
  onClick: (genders: number) => void;
  onClose: () => void;
}

export const GenderDialog: React.FC<GenderDialogProps> = ({
  onClick,
  onClose,
}) => {
  const handleGenderSelect = (gender: number) => {
    onClick(gender);
    onClose();
  };

  return (
    <div className='fixed inset-0 z-[100] flex flex-col justify-end'>
      <div
        className='absolute inset-0 bg-black/40 animate-fade-in'
        onClick={onClose}
      />
      <div className='bg-white rounded-t-2xl z-10 p-6 pb-safe animate-slide-up space-y-2'>
        <h3 className='text-center font-bold text-gray-400 text-sm mb-4'>
          选择性别
        </h3>
        <button
          onClick={() => handleGenderSelect(1)}
          className='w-full py-3 bg-gray-50 rounded-xl font-bold text-gray-800 active:bg-gray-100'
        >
          男
        </button>
        <button
          onClick={() => handleGenderSelect(2)}
          className='w-full py-3 bg-gray-50 rounded-xl font-bold text-gray-800 active:bg-gray-100'
        >
          女
        </button>
        <button
          onClick={() => handleGenderSelect(2)}
          className='w-full py-3 bg-gray-50 rounded-xl font-bold text-gray-800 active:bg-gray-100'
        >
          未知
        </button>
        <div className='h-2'></div>
        <button
          onClick={onClose}
          className='w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500'
        >
          取消
        </button>
      </div>
    </div>
  );
};
