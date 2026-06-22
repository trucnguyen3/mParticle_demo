import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình vừa tạo
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';

// Khởi tạo bộ định tuyến Stack
const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      {/* initialRouteName="Onboarding" nghĩa là app mở lên sẽ vào Onboarding đầu tiên.
        screenOptions={{ headerShown: false }} dùng để ẩn thanh header mặc định của thư viện đi nếu bạn muốn tự làm giao diện đẹp hơn.
      */}
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ title: 'Giới thiệu' }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Đăng Nhập', headerLeft: () => null }} // Ẩn nút back ở màn Login
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ title: 'Đăng Ký' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Trang Chủ', headerLeft: () => null }} // Ẩn nút back ở màn Home
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;