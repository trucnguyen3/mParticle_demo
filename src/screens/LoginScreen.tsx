import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// Import mParticle
import MParticle from 'react-native-mparticle';

export default function LoginScreen({ navigation }: any) {

    const [currentMPID, setCurrentMPID] = useState<string | null>(null);
      const [previousUserObj, setPreviousUserObj] = useState<any>(null);
      const [isLoading, setIsLoading] = useState<boolean>(true);

      // 1. Dùng useEffect để lấy thông tin User ngay khi vừa vào màn hình
      useEffect(() => {
        console.log('--- MÀN HÌNH LOGIN KÍCH HOẠT ---');

        MParticle.Identity.getCurrentUser((currentUser) => {
          if (currentUser) {
            const mpid = currentUser.mpid || currentUser.userId;
            console.log('useEffect - Đã lấy được MPID hiện tại:', mpid);

            setCurrentMPID(mpid);      // Lưu MPID vào state để dùng ở bất cứ đâu trong file
            setPreviousUserObj(mpid);  // Lưu giữ object user cũ phục vụ cho việc Alias nếu cần
          } else {
            console.log('useEffect - Chưa có thông tin user.');
          }
          setIsLoading(false);
        });
      }, []);

const handleLoginSuccess = () => {
    // Giả lập thông tin của một User có sẵn trong hệ thống của bạn
    const identityRequest = {
      email: 'truc.nguyen@akadigital.net',
      customerId: 'CDP_03'
    };

    // 1. Gọi Identity để mParticle nhận diện User cũ đăng nhập lại
    MParticle.Identity.login(identityRequest, (error, userId) => {
      if (!error) console.log('mParticle Login thành công cho user:', userId);

      const aliasRequest = {
                sourceMpid: previousUserObj,
                destinationMpid: userId,
                // startTime và endTime có thể bỏ qua vì code Native có check: if (startTime == null && endTime == null)
              };

              // Gọi hàm aliasUsers của module mParticle
              MParticle.Identity.aliasUsers(aliasRequest, (success: boolean, errorMessage: string) => {
                if (success) {
                  console.log('✅ Alias thành công rực rỡ!');
                } else {
                  console.error('❌ Alias thất bại:', errorMessage);
                }
              });
    });

    // 2. Log sự kiện đăng nhập thành công
    MParticle.logEvent(
      'fde_login_success',
      MParticle.EventType.Other, // Loại sự kiện chung
      { 'login_method': 'Email_Password' }
    );

    navigation.replace('Home');
  };


  const navigateToSignup = () => {
    MParticle.logEvent(
      'Navigate_To_Signup',
      MParticle.EventType.Navigation,
      { 'from_screen': 'Login' }
    );

    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Màn hình Đăng Nhập</Text>
      <Button title="Đăng nhập thành công" onPress={handleLoginSuccess} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Chưa có tài khoản? Đăng ký" onPress={navigateToSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2f3' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
});