import React, { useEffect } from 'react'; // Sửa lại cách import React chuẩn
import { StyleSheet, Text, View, Button } from 'react-native';
// Import mParticle
import MParticle from 'react-native-mparticle';

export default function HomeScreen({ navigation }: any) {

  useEffect(() => {
    // 1. Sửa cú pháp logEvent: Cách an toàn nhất trong React Native là truyền Tên sự kiện + Object thuộc tính
    // Nếu muốn chỉ định EventType, bạn phải truyền qua một Object cấu hình (tùy thuộc vào phiên bản SDK)
    // Cách viết đơn giản và an toàn nhất để tránh lỗi kẹt tham số:
    MParticle.logEvent('fde_home', MParticle.EventType.Navigation, {
      'screen_name': 'Home'
    });

    console.log('mParticle: Đã log sự kiện fde_home');
  }, []);

  const handleLogout = async () => {
    console.log('--- BẮT ĐẦU ĐĂNG XUẤT ---');

    try {
      // 1. Log sự kiện click Đăng xuất trước khi xóa danh tính
        MParticle.logEvent('fde_logout', MParticle.EventType.Other, {
          'last_active_screen': 'Home'
        });

      // 2. Chuyển hàm logout của mParticle sang dạng async/await thuần túy (Bỏ hàm callback)
      const logoutRequest = {};
      console.log('Đang gọi logout lên mParticle...');
      const identityResult = await MParticle.Identity.logout(logoutRequest);

      const anonymousUser = identityResult?.user;
      console.log('mParticle đã Logout an toàn. MPID ẩn danh mới hiện tại:', anonymousUser?.mpid);

      // 3. Quay lại màn hình Login
      navigation.replace('Login');

    } catch (err) {
      console.error('❌ LỖI CRASH TRONG HÀM LOGOUT:', err);
      // Dù có lỗi SDK, vẫn nên cho user về màn hình Login để tránh kẹt ứng dụng
      navigation.replace('Login');
    }
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