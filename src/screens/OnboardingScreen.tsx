import { React, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// Import mParticle
import MParticle from 'react-native-mparticle';

export default function OnboardingScreen({ navigation }: any) {

useEffect(() => {
  let attempts = 0;
  const maxAttempts = 10;

  const checkAttribution = () => {
    attempts++;
    console.log(`\n🔄 [Vòng lặp ${attempts}] Gọi hàm getAttributions()...`);

    (MParticle as any).getAttributions((results: any) => {

      // ==========================================
      // 1. LOG NGUYÊN BẢN OBJECT RESULTS RA ĐỂ XEM
      // ==========================================
      console.log(`[Vòng lặp ${attempts}] Cấu trúc kết quả thô trả về từ Native:`);
      console.log(JSON.stringify(results, null, 2));
      // ==========================================

      if (results && Object.keys(results).length > 0) {
        const kitKeys = Object.keys(results);
        let appsFlyerData = null;
        let activeKitKey = '';

        // Tìm xem có Kit 92 (AppsFlyer) trong danh sách trả về không
        for (const key of kitKeys) {
          if (key === '92' || results[key]?.kitId === 92) {
            appsFlyerData = results[key];
            activeKitKey = key;
            break;
          }
        }

        if (!appsFlyerData) {
          activeKitKey = kitKeys[0];
          appsFlyerData = results[activeKitKey];
        }

        if (appsFlyerData && appsFlyerData.linkParameters) {
          try {
            const exactParams = JSON.parse(appsFlyerData.linkParameters);

            // Nếu đã có af_status (Dữ liệu Conversion đổ về thành công)
            if (exactParams && exactParams.af_status) {
              console.log("✅ ĐÃ BẮT ĐƯỢC CONVERSION DATA CỦA APPSFLYER!");
              console.log("-> Trạng thái:", exactParams.af_status);
              console.log("-> Media Source:", exactParams.media_source || "N/A (Organic)");
              console.log("-> Campaign:", exactParams.campaign || "N/A (Organic)");

              clearInterval(intervalId);
              return;
            } else {
              console.log("⏳ Có linkParameters nhưng AppsFlyer chưa trả về af_status...");
            }
          } catch (parseError) {
            console.log("⚠️ Không thể parse linkParameters (Có thể chuỗi chưa đúng định dạng JSON):", parseError);
          }
        }
      } else {
        console.log("📭 Object results trả về rỗng {} (Native chưa nạp xong dữ liệu).");
      }

      if (attempts >= maxAttempts) {
        console.log("❌ Đã hết 10 lượt thử. Dừng loop.");
        clearInterval(intervalId);
      }
    });
  };

  const intervalId = setInterval(checkAttribution, 1000);
  return () => clearInterval(intervalId);
}, []);

  const handleGetStarted = () => {
    // 1. Log sự kiện người dùng vượt qua màn hình Onboarding
    MParticle.logEvent(
      'fde_onboarding_started',
      MParticle.EventType.Navigation, // Sử dụng Navigation vì đây là hành vi chuyển luồng màn hình
      { 'source_screen': 'Onboarding' }
    );

    // 2. Chuyển hướng
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng bạn đến với Ứng dụng!</Text>
      <Button title="Bắt đầu ngay" onPress={handleGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5fcff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
