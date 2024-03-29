# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-svg https://github.com/react-native-svg/react-native-svg#problems-with-proguard
-keep public class com.horcrux.svg.** {*;}

# react-native-reanimated https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# react-native-device-info
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}

# react-native-date-picker https://github.com/henninghall/react-native-date-picker#why-does-the-android-app-crash-in-production
-keep public class net.time4j.android.ApplicationStarter
-keep public class net.time4j.PrettyTime

# react-native-fast-image 
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# react-native-config https://github.com/luggit/react-native-config#problems-with-proguard
-keep class com.trenderapp.social.BuildConfig { *; }

# react-native-inappbrowser-reborn https://github.com/proyecto26/react-native-inappbrowser#android
-keepattributes *Annotation*
-keepclassmembers class ** {
  @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }