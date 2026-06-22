import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
// Import thư viện mParticle
import MParticle from 'react-native-mparticle';

export default function SignupScreen({ navigation }: any) {
  // Tạo các state để lưu thông tin người dùng nhập vào
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSignup = () => {
    if (!email || !username) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // --- 1. ĐỊNH DANH NGƯỜI DÙNG (IDENTITY) ---
    // Tạo một request chứa các thông tin định danh của User vừa đăng ký
    const identityRequest = {
      email: 'truc.nguyen@akadigital.net',
      customerId: 'CDP_03', // ID chính của hệ thống

      // Gắn thêm các loại ID tùy biến khác bằng nhãn định danh tùy chọn
      identities: {
        // Giả sử hệ thống mParticle nhận diện một thẻ tùy biến 'other'
        // để bạn lưu một ID từ bên thứ 3 (Ví dụ: ID của hệ thống POS tại cửa hàng)
        other: 'TR_AKA_03'
      }
    };

    MParticle.Identity.login(identityRequest, (error, userId) => {
      // ...
    });

    // Gọi hàm identify hoặc login để gửi thông tin định danh lên mParticle
    MParticle.Identity.login(identityRequest, (error, userId) => {
      if (error) {
        console.error('mParticle Identity Error:', error);
      } else {
        console.log('mParticle Identity thành công! User ID hệ thống:', userId);
      }
    });


    // --- 2. GHI NHẬN SỰ KIỆN (LOG EVENT) ---
    // Định nghĩa các thuộc tính đi kèm với sự kiện đăng ký này
    const eventAttributes = {
      registration_method: 'Email', // Phương thức đăng ký
      newsletter_subscribed: 'true', // Ví dụ người dùng đồng ý nhận tin tức
    };

    // Thực hiện logEvent: Tên sự kiện, Loại sự kiện, và Các thuộc tính đi kèm
    MParticle.logEvent(
      'fde_signup_success',               // Tên sự kiện (Event Name)
      MParticle.EventType.UserPreference,  // Loại sự kiện (Event Type)
      eventAttributes                      // Thuộc tính (Attributes)
    );

    // Thông báo và chuyển hướng người dùng
    Alert.alert('Thành công', 'Tài khoản đã được đăng ký và đồng bộ mParticle!', [
      { text: 'OK', onPress: () => navigation.replace('Home') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Đăng Ký Tài Khoản</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập Email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập Tên người dùng"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Button title="Tiến hành Đăng Ký" color="#28a745" onPress={handleSignup} />
      </View>

      <Button title="Quay lại Đăng nhập" color="#6c757d" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
});