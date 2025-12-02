package com.corpease

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "corpease"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Enable Firebase Phone Auth test mode for development
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Initialize Firebase if not already initialized
    if (FirebaseApp.getApps(this).isEmpty()) {
      FirebaseApp.initializeApp(this)
    }

    // Enable test mode for Firebase Phone Authentication
    // This disables reCAPTCHA and allows test numbers to work
    // NOTE: This should be disabled for production builds
    FirebaseAuth.getInstance().firebaseAuthSettings.setAppVerificationDisabledForTesting(true)
  }
}