import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// Import mParticle
import MParticle from 'react-native-mparticle';

export default function LoginScreen({ navigation }: any) {
  const handleLoginSuccess = () => {
    // Giả lập thông tin của một User có sẵn trong hệ thống của bạn
    const identityRequest = {
      email: 'truc.nguyen@akadigital.net',
      customerId: 'CDP_03'
    };

    // 1. Gọi Identity để mParticle nhận diện User cũ đăng nhập lại
    MParticle.Identity.login(identityRequest, (error, userId) => {
      if (!error) console.log('mParticle Login thành công cho user:', userId);
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
    // Log hành vi chủ động chuyển sang màn hình Đăng ký
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