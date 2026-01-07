import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChevronLeft, Minus, Menu, Plus } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { AppContext } from '@/context/AppContext';
// import { TransactionType, Category } from '@/types';
import { AddCategoryPage } from './AddCategoryPage';

interface CategorySettingsPageProps {
  onClose: () => void;
}

export const CategorySettingsPage: React.FC<CategorySettingsPageProps> = ({
  onClose,
}) => {
  const { expenseCategories, deleteCategory, updateLedger, currentLedger } =
    useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);

  // Local state for live reordering
  const [localCategories, setLocalCategories] =
    useState<Category[]>(expenseCategories);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync with context if context changes externally (though we drive UI from local during drag)
  useEffect(() => {
    setLocalCategories(expenseCategories);
  }, [expenseCategories]);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle Drag Enter (Live Reordering)
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;

    if (dragItem.current === null || dragItem.current === index) return;

    const newCats = [...localCategories];
    const draggedCat = newCats[dragItem.current];

    // Remove from old position
    newCats.splice(dragItem.current, 1);
    // Insert at new position
    newCats.splice(index, 0, draggedCat);

    // Update ref to new position
    dragItem.current = index;

    setLocalCategories(newCats);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;

    // Persist changes to Global Context
    // We must merge with Income categories which are not shown here
    const incomeCategories =
      currentLedger.categories?.filter(
        c => c.type === TransactionType.INCOME
      ) || [];
    const updatedAll = [...localCategories, ...incomeCategories];

    updateLedger({
      ...currentLedger,
      categories: updatedAll,
    });
  };

  if (showAdd) {
    return (
      <AddCategoryPage
        type={TransactionType.EXPENSE}
        onClose={() => setShowAdd(false)}
      />
    );
  }

  return (
    <div className='absolute inset-0 bg-white z-[70] flex flex-col animate-slide-up'>
      {/* Header */}
      <div className='bg-primary px-4 py-3 flex items-center relative shadow-sm z-10'>
        <button
          onClick={onClose}
          className='flex items-center text-black/70 active:opacity-50 transition-opacity'
        >
          <ChevronLeft size={24} />
          <span className='font-medium ml-1'>返回</span>
        </button>
        <div className='absolute left-1/2 -translate-x-1/2 font-bold text-lg'>
          分类设置
        </div>
      </div>

      {/* List */}
      <div className='flex-1 overflow-y-auto pb-24'>
        {localCategories.map((cat, index) => {
          const isDragging = draggedIndex === index;
          return (
            <div
              key={cat.id}
              className={`flex items-center px-4 py-3 border-b border-gray-100 transition-colors duration-200
                        ${isDragging ? 'bg-gray-50' : 'bg-white'}
                    `}
              draggable
              onDragStart={e => handleDragStart(e, index)}
              onDragEnter={e => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteCategory(cat.id, TransactionType.EXPENSE)}
                className={`w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-4 shadow-sm active:scale-90 transition flex-shrink-0 ${
                  isDragging ? 'opacity-30' : ''
                }`}
              >
                <Minus size={16} className='text-white' />
              </button>

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-transform duration-200 ${
                  isDragging ? 'scale-110 bg-white shadow-md' : 'bg-gray-100'
                }`}
              >
                <Icon name={cat.icon} size={20} className='text-gray-600' />
              </div>

              {/* Name */}
              <span
                className={`flex-1 font-medium text-gray-800 transition-opacity duration-200 ${
                  isDragging ? 'opacity-50' : ''
                }`}
              >
                {cat.name}
              </span>

              {/* Drag Handle */}
              <div
                className={`p-2 text-gray-300 hover:text-gray-500 cursor-move active:text-primary active:scale-110 transition-transform ${
                  isDragging ? 'text-primary' : ''
                }`}
              >
                <Menu size={20} />
              </div>
            </div>
          );
        })}

        {localCategories.length === 0 && (
          <div className='p-8 text-center text-gray-400 text-sm'>
            暂无分类，请添加。
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div
        className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100'
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setShowAdd(true)}
          className='w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition flex items-center justify-center space-x-2'
        >
          <Plus size={20} />
          <span>添加分类</span>
        </button>
      </div>
    </div>
  );
};
