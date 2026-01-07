import React, { useState, useEffect } from 'react';
import { View, Text, Input, Image, ScrollView, RootPortal } from '@tarojs/components';
import { Icon } from '@/components/ui/Icon';
import { MemberSearchResult } from '@/types';

interface SearchPageProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: MemberSearchResult) => void;
}

// 定义颜色常量
const COLORS = {
  white: '#ffffff',
  gray100: '#f3f4f6',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray800: '#1f2937',
  primaryDark: '#49807D',
};

export const SearchPage: React.FC<SearchPageProps> = ({ isOpen, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MemberSearchResult[]>([]);

  // 使用 state 控制聚焦，替代 ref.focus()
  const [isFocused, setIsFocused] = useState(false);

  // 每次打开清空状态并聚焦
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      // 稍微延迟聚焦，等待动画完成
      setTimeout(() => setIsFocused(true), 300);
    } else {
      setIsFocused(false);
    }
  }, [isOpen]);

  // 防抖搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      console.log(`Searching for: ${query}`);
      // 模拟 API 请求
      const mockResult: MemberSearchResult[] = [
        {
          id: Date.now(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${query}`,
          nickname: `${query}_用户`,
        },
      ];
      setResults(mockResult);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <RootPortal>
      <View
        className='animate-fade-in' // 需在 common.scss 定义淡入动画
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 800,
          backgroundColor: COLORS.white,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 搜索头 */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '16px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: COLORS.gray100,
            gap: '12px',
            // 适配顶部安全区
            // paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* Input Container */}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.gray100,
              borderRadius: '999px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: '16px',
              paddingRight: '16px',
              height: '40px',
            }}
          >
            <Icon name='Search' size={18} color={COLORS.gray400} />

            <Input
              type='text'
              focus={isFocused} // 绑定 focus 状态
              className='bg-transparent border-none outline-none text-sm w-full'
              placeholder='输入昵称或ID搜索'
              value={query}
              // 小程序 Input 事件
              onInput={e => setQuery(e.detail.value)}
              confirmType='search'
              style={{
                flex: 1,
                fontSize: '14px',
                marginLeft: '8px',
                marginRight: '8px',
                height: '100%',
              }}
              placeholderStyle='color: #9ca3af'
            />

            {query && (
              <View onClick={() => setQuery('')} style={{ padding: '4px' }}>
                <Icon name='X' size={16} color={COLORS.gray400} />
              </View>
            )}
          </View>

          {/* Cancel Button */}
          <View onClick={onClose} style={{ padding: '4px' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.gray600 }}>取消</Text>
          </View>
        </View>

        {/* 搜索结果 */}
        {/* [pages/index/index] [Component] <scroll-view>: the padding property is not yet supported in webview rendering mode
            请不要把 padding 写在 <ScrollView> 上，而是在 <ScrollView> 内部套一个 <View>，并将 padding 写在这个内部的 <View> 上。
            把 padding 移到新增一个包裹容器
        */}
        <ScrollView
          scrollY
          style={{
            flex: 1,
            // padding: '16px', //不要写 padding
          }}
        >
          <View
            style={{
              padding: '16px',
              boxSizing: 'border-box', // 建议加上，防止宽度撑破
              width: '100%',
            }}
          >
            {loading ? (
              <View style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
                {/* animate-spin 需要在 common.scss 定义旋转动画 */}
                <View className='animate-spin'>
                  <Icon name='Loader2' color={COLORS.gray400} size={24} />
                </View>
              </View>
            ) : results.length > 0 ? (
              <View style={{ paddingBottom: '40px' }}>
                <Text
                  style={{
                    fontSize: '12px',
                    color: COLORS.gray400,
                    fontWeight: 500,
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  搜索结果
                </Text>

                {results.map(user => (
                  <View
                    key={user.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: COLORS.white,
                      paddingTop: '8px',
                      paddingBottom: '8px',
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                      <Image
                        src={user.avatar}
                        mode='aspectFill'
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '999px',
                          backgroundColor: COLORS.gray100,
                        }}
                      />
                      <Text style={{ fontWeight: 'bold', color: COLORS.gray800 }}>{user.nickname}</Text>
                    </View>

                    <View
                      onClick={() => {
                        onAdd(user);
                        onClose();
                      }}
                      hoverStyle={{ transform: 'scale(0.95)', opacity: 0.9 }}
                      style={{
                        backgroundColor: COLORS.primaryDark,
                        padding: '6px 16px',
                        borderRadius: '999px',
                      }}
                    >
                      <Text style={{ fontSize: '12px', color: COLORS.white, fontWeight: 'bold' }}>添加</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : query ? (
              <View style={{ textAlign: 'center', paddingTop: '40px' }}>
                <Text style={{ fontSize: '14px', color: COLORS.gray400 }}>未找到相关用户</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </RootPortal>
  );
};
