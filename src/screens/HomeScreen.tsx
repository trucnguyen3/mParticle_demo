import { React, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// Import mParticle
import MParticle from 'react-native-mparticle';

export default function HomeScreen({ navigation }: any) {

  useEffect(() => {
    // Thêm đoạn logEvent của bạn tại đây
    MParticle.logEvent(
      'fde_home',
      MParticle.EventType.Navigation // Sử dụng Navigation vì đây là hành vi chuyển luồng màn hình
    );
    console.log('mParticle: Đã log sự kiện fde_home');
  }, []);

  const handleLogout = () => {
    // 1. Log sự kiện click Đăng xuất trước khi xóa danh tính
    MParticle.logEvent(
      'fde_logout',
      MParticle.EventType.Other,
      { 'last_active_screen': 'Home' }
    );

    // 2. Gọi hàm logout của mParticle để hủy trạng thái định danh (chuyển về Anonymous User)
    const logoutRequest = {}; // Bạn có thể để trống hoặc truyền các thông tin cần thay đổi
    MParticle.Identity.logout(logoutRequest, (error, userId) => {
      if (!error) {
        console.log('mParticle đã Logout an toàn. Thiết bị quay về trạng thái Anonymous.');
      }
    });

    // 3. Quay lại màn hình Login
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Màn hình Trang Chủ</Text>
      <Text style={{ marginBottom: 20 }}>Bạn đã đăng nhập thành công!</Text>
      <Button title="Đăng xuất" color="#dc3545" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 10 },
});