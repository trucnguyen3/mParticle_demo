package com.forwardingevent

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.mparticle.AttributionError
import com.mparticle.AttributionListener
import com.mparticle.AttributionResult
import com.mparticle.MParticle;
import com.mparticle.MParticleOptions
import com.mparticle.identity.BaseIdentityTask

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }

      val options: MParticleOptions? = MParticleOptions.builder(this)
          .credentials("abc", "abc")
          .logLevel(MParticle.LogLevel.VERBOSE) //.identify(identifyRequest)
          .attributionListener(object : AttributionListener {
              override fun onResult(result: AttributionResult) {
                  // Không cần viết gì ở đây, mParticle Native tự xử lý lưu trữ ngầm
                  println("mParticle nhận được dữ liệu cài đặt thành công từ Kit")
              }
              override fun onError(error: AttributionError) {
                  println("mParticle lỗi nhận dữ liệu: ${error.message}")
              }
          })
          .build()

      MParticle.start(options!!)
  }
}
