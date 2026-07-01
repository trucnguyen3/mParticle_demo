import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MParticle from 'react-native-mparticle';

export default function LoginScreen({ navigation }: any) {

    const [currentMPID, setCurrentMPID] = useState<string | null>(null);
      const [previousUserObj, setPreviousUserObj] = useState<any>(null);
      const [isLoading, setIsLoading] = useState<boolean>(true);

      useEffect(() => {
        MParticle.Identity.getCurrentUser((currentUser) => {
          if (currentUser) {
            const mpid = currentUser.mpid || currentUser.userId;
            setCurrentMPID(mpid);
            setPreviousUserObj(mpid);
          } else {
            console.log('abc');
          }
          setIsLoading(false);
        });
      }, []);

const handleLoginSuccess = () => {
    const identityRequest = {
      email: 'truc.nguyen@akadigital.net',
      customerId: 'CDP_03'
    };

    MParticle.Identity.login(identityRequest, (error, userId) => {
      if (!error) console.log('mParticle after login:', userId);

      const aliasRequest = {
        sourceMpid: previousUserObj,
        destinationMpid: userId,
      };

              // Gọi hàm aliasUsers của module mParticle
              MParticle.Identity.aliasUsers(aliasRequest, (success: boolean, errorMessage: string) => {
                if (success) {
                  console.log('Alias success');
                } else {
                  console.error('Alias fail:', errorMessage);
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