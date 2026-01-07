import { View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import MainAppComponent from '@/pages/index/Main';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className='index'>
      <MainAppComponent />
      {/* <Text>Hello World</Text> */}
    </View>
  );
}
