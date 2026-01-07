import React, { useState, useContext } from 'react';
import { ChevronLeft, Smartphone } from 'lucide-react';
import { AppContext } from '@/context/AppContext';

interface ChangePhonePageProps {
  onClose: () => void;
}

export const ChangePhonePage: React.FC<ChangePhonePageProps> = ({
  onClose,
}) => {
  const { updateUserProfile } = useContext(AppContext);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);

  const handleSave = () => {
    if (phone.length > 5) {
      // Mask the phone for display
      const masked =
        phone.length > 7
          ? phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)
          : phone;
      updateUserProfile({ phone: masked });
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-white z-[90] flex flex-col animate-slide-up'>
      <div className='bg-white px-4 py-4 flex items-center border-b border-gray-100 relative shadow-sm'>
        <button
          onClick={onClose}
          className='p-2 -ml-2 hover:bg-gray-100 rounded-full absolute left-4'
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className='flex-1 text-center font-bold text-lg'>更换手机号</h1>
      </div>

      <div className='p-6'>
        <div className='flex flex-col space-y-6'>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              新手机号
            </label>
            <div className='flex items-center border-b-2 border-gray-100 focus-within:border-primary transition'>
              <Smartphone size={20} className='text-gray-400 mr-2' />
              <input
                type='tel'
                placeholder='请输入手机号'
                className='flex-1 py-3 outline-none text-lg font-medium'
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              验证码
            </label>
            <div className='flex items-center space-x-3'>
              <div className='flex-1 border-b-2 border-gray-100 focus-within:border-primary transition'>
                <input
                  type='number'
                  placeholder='请输入验证码'
                  className='w-full py-3 outline-none text-lg font-medium'
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
              </div>
              <button className='bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200'>
                获取验证码
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={phone.length < 8 || code.length < 4}
            className='w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 active:scale-[0.98] transition disabled:opacity-50 disabled:shadow-none'
          >
            确认更换
          </button>
        </div>
      </div>
    </div>
  );
};
