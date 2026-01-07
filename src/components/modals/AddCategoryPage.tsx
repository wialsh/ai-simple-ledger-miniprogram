import React, { useState, useContext } from 'react';
import { Icon } from '@/components/ui/Icon';
import { AppContext } from '@/context/AppContext';
// import { TransactionType, Category } from '@/types';
// import { AVAILABLE_ICONS } from '@/constants';

interface AddCategoryPageProps {
  type: TransactionType;
  onClose: () => void;
}

export const AddCategoryPage: React.FC<AddCategoryPageProps> = ({
  type,
  onClose,
}) => {
  const { currentLedger, updateLedger } = useContext(AppContext);

  // Get currently active categories for this ledger and type
  const activeCategories =
    currentLedger.categories?.filter(
      c => c.type === type || (!c.type && type === TransactionType.EXPENSE)
    ) || [];

  const [namingIcon, setNamingIcon] = useState<string | null>(null);
  const [nameInput, setnameInput] = useState('');

  const handleIconClick = (icon: string) => {
    setNamingIcon(icon);
    // Pre-fill name if it already exists
    const existing = activeCategories.find(c => c.icon === icon);
    setnameInput(existing ? existing.name : '');
  };

  const handleConfirmCategory = () => {
    if (namingIcon && nameInput.trim()) {
      const newName = nameInput.trim().substring(0, 4);

      let newCategories = [...(currentLedger.categories || [])];
      const existingIndex = newCategories.findIndex(
        c =>
          c.icon === namingIcon &&
          (c.type === type || (!c.type && type === TransactionType.EXPENSE))
      );

      if (existingIndex >= 0) {
        // Rename existing
        newCategories[existingIndex] = {
          ...newCategories[existingIndex],
          name: newName,
        };
      } else {
        // Add new
        const newCat: Category = {
          id: Date.now().toString() + Math.random(),
          name: newName,
          icon: namingIcon,
          type: type,
          color: '#76BDB9',
        };
        newCategories.push(newCat);
      }

      updateLedger({
        ...currentLedger,
        categories: newCategories,
      });
      setNamingIcon(null);
    }
  };

  return (
    <div className='absolute inset-0 bg-white z-[80] flex flex-col animate-slide-up'>
      {/* Header */}
      <div className='bg-primary px-4 py-4 flex items-center justify-between shadow-sm z-10'>
        <button onClick={onClose} className='text-black/70 font-medium'>
          取消
        </button>
        <div className='font-bold text-lg'>
          添加{type === TransactionType.EXPENSE ? '支出' : '收入'}分类
        </div>
        <button
          onClick={onClose}
          className='bg-black text-primary px-4 py-1.5 rounded-full font-bold text-sm'
        >
          完成
        </button>
      </div>

      {/* Icon Grid */}
      <div className='flex-1 overflow-y-auto p-6 pb-safe bg-white'>
        <h3 className='text-gray-500 text-sm font-medium mb-4 text-center'>
          选择图标
        </h3>
        <div className='grid grid-cols-5 gap-4'>
          {AVAILABLE_ICONS.map(icon => {
            const selected = activeCategories.find(c => c.icon === icon);
            return (
              <button
                key={icon}
                onClick={() => handleIconClick(icon)}
                className={`aspect-square rounded-full flex flex-col items-center justify-center transition duration-200 ${
                  selected
                    ? 'bg-primary scale-110 shadow-md'
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <Icon
                  name={icon}
                  size={20}
                  className={selected ? 'text-black' : 'text-gray-400'}
                />
                {selected && (
                  <span className='text-[9px] font-bold mt-1'>
                    {selected.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup for Category Naming */}
      {namingIcon && (
        <div className='fixed inset-0 bg-black/50 z-[90] flex items-center justify-center p-4 animate-fade-in'>
          <div className='bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform scale-100'>
            <h3 className='text-lg font-bold text-center mb-6'>
              {activeCategories.find(c => c.icon === namingIcon)
                ? '重命名分类'
                : '新分类'}
            </h3>
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 rounded-full bg-primary flex items-center justify-center'>
                <Icon name={namingIcon} size={32} />
              </div>
            </div>
            <input
              type='text'
              autoFocus
              placeholder='名称 (最多4字)'
              maxLength={4}
              className='w-full bg-gray-100 p-4 rounded-xl text-center font-bold text-lg outline-none mb-6'
              value={nameInput}
              onChange={e => setnameInput(e.target.value)}
            />
            <div className='flex space-x-3'>
              <button
                onClick={() => setNamingIcon(null)}
                className='flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-500'
              >
                取消
              </button>
              <button
                onClick={handleConfirmCategory}
                className='flex-1 py-3 rounded-xl bg-primary font-bold text-black'
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
