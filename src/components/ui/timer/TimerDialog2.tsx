import React, { useState } from 'react';
import { Timer } from './TimerBasic';

interface TimerDialog2Props {
  date: Date;
  onClick: (d: Date) => void;
  onClose: () => void;
}

export const TimerDialog2: React.FC<TimerDialog2Props> = ({ date, onClick, onClose }) => {
  const [wheelDate, setWheelDate] = useState(date);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleStart = () => {
    if (!isAgreed) {
      alert('请先同意分享协议');
      return;
    }
    onClick(wheelDate);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6 animate-fade-in touch-none'
    >
      {/* 主卡片 */}
      <div
        className='relative bg-white w-[90%] max-w-[380px] rounded-xl mt-5 py-10 px-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center text-center'
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <h1 className='text-[20px] text-[#333] mb-2.5 font-semibold'>设置共享开始时间</h1>
        <p className='text-[13px] text-[#999] mb-[30px]'>将向另一半共享该日期后的全部数据</p>

        {/* 滚轮选择器区域 */}
        <Timer date={wheelDate} setDate={setWheelDate} />

        {/* 底部按钮区域 */}
        <div className='w-full flex flex-col items-center'>
          <button
            className='bg-[#fcd535] text-[#333] border-none w-full py-[14px] rounded-[30px] text-[16px] font-semibold cursor-pointer mb-5 hover:bg-[#eec625] transition-colors active:scale-95'
            onClick={handleStart}
          >
            开启家庭账单
          </button>

          <div
            className='flex items-center text-[13px] text-[#999] cursor-pointer select-none p-2'
            onClick={() => setIsAgreed(!isAgreed)}
          >
            {/* 单选框圆圈 */}
            <div
              className={`w-4 h-4 border rounded-full mr-1.5 flex items-center justify-center transition-colors ${
                isAgreed ? 'border-[#fcd535]' : 'border-[#ccc]'
              }`}
            >
              {isAgreed && <div className='w-2.5 h-2.5 bg-[#fcd535] rounded-full' />}
            </div>
            <span>同意将记账数据分享给另一半</span>
          </div>
        </div>
      </div>
    </div>
  );
};
