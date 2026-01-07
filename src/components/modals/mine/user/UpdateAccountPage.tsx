import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface UpdateAccountPageProps {
  account: string;
  onBack: () => void;
  onSave: (newAccount: string) => void;
}

export const UpdateAccountPage: React.FC<UpdateAccountPageProps> = ({
  account,
  onBack,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState(account);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 校验逻辑
  const validateAccount = (val: string): string | null => {
    // 规则1: 长度 6-20
    if (val.length < 6 || val.length > 20) {
      return '账号长度限 6-20 位，建议避免包含姓名、生日等涉及个人隐私信息。';
    }

    // 规则2: 必须以字母或下划线开头
    // 规则3: 只能包含数字、字母、下划线、减号
    const regex = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;

    if (!regex.test(val)) {
      return '账号必须以字母或者下划线开头，可以使用6-20位数字、字母、下划线、减号或它们的组合。';
    }

    return null;
  };

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // 输入时实时清除之前的特定格式错误，或者你可以选择实时校验
    if (errorMsg) setErrorMsg(null);
  };

  // 处理提交
  const handleSubmit = () => {
    const error = validateAccount(inputValue);
    if (error) {
      setErrorMsg(error);
      // 这里的错误文案如果是“必须以字母...开头”，根据截图需要显示红底白字
      // 如果只是长度提示，截图显示的是灰色的提示文字，这里为了复刻截图的红色报错，我们主要处理正则错误
    } else {
      setErrorMsg(null);
      onSave(inputValue);
    }
  };

  // 判断当前错误是否需要显示为顶部红色Banner
  // 截图逻辑：当违反字符规则时显示红色Banner
  const isFormatError = errorMsg;

  return (
    // 添加 fixed inset-0 z-[100] 和动画类
    // - fixed inset-0: 强制全屏覆盖
    // - z-[100]: 确保层级高于底部导航栏和顶部 Header
    // - animate-slide-up (或 animate-slide-in-right): 进入动画
    <div className='fixed inset-0 z-[100] bg-white flex flex-col animate-slide-up overflow-hidden'>
      {/* 顶部导航 */}
      <div className='flex items-center px-4 h-[44px] shrink-0'>
        <button
          onClick={onBack}
          className='-ml-2 p-2 active:bg-gray-100 rounded-full'
        >
          <ChevronLeft size={24} className='text-black' />
        </button>
        {/* 如果需要标题可以在这里加，微信这个页面通常只有返回箭头或者中间有标题 */}
      </div>

      {/* 红色错误提示栏 - 仅在格式错误时显示 */}
      {isFormatError && (
        <div className='bg-[#fa5151] px-6 py-3 flex items-center justify-center animate-fade-in'>
          <p className='text-white text-[14px] leading-relaxed text-left'>
            {errorMsg}
          </p>
        </div>
      )}

      <div className='px-8 mt-4 flex flex-col items-center'>
        {/* 顶部提示文字 - 如果没有红色报错，则显示默认提示 */}
        {!isFormatError && (
          <p className='text-center text-gray-900 text-[15px] leading-relaxed mb-10 px-2'>
            账号长度限 6-20 位，建议避免包含姓名、生日等涉及个人隐私信息。
          </p>
        )}

        {/* 如果有红色报错，这里需要留出一点间距，或者根据设计调整 */}
        {isFormatError && <div className='h-10'></div>}

        {/* 输入框区域 */}
        <div className='w-full flex items-center border-b border-gray-200 py-3 mb-10'>
          <label className='text-black text-[17px] w-20 font-medium shrink-0'>
            账号
          </label>

          <div className='flex-1 flex items-center relative'>
            <input
              autoFocus
              type='text'
              value={inputValue}
              onChange={handleChange}
              // caret-：Tailwind 的 光标颜色前缀
              className='w-full text-[17px] text-black outline-none bg-transparent font-sans caret-primary-dark'
              // 模拟截图中的非法输入展示
              // placeholder={user.account}
            />

            {/* 清除按钮 */}
            {inputValue.length > 0 && (
              <button
                onClick={() => {
                  setInputValue('');
                  setErrorMsg(null);
                }}
                className='ml-2 p-1 text-gray-300 hover:text-gray-500 transition-colors'
              >
                <div className='bg-gray-300 rounded-full p-0.5'>
                  <X size={12} className='text-white' strokeWidth={3} />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 下一步按钮 */}
        <button
          onClick={handleSubmit}
          disabled={inputValue.length === 0}
          className={`
            w-full max-w-[300px] py-3 rounded-lg text-[17px] font-medium tracking-wide transition-all
            ${
              inputValue.length > 0
                ? 'bg-primary-dark text-white active:bg-primary-dark5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          下一步
        </button>
      </div>
    </div>
  );
};
