## Step-by-Step Font Setup Guide for Corpease

### **📥 Step 1: Download Font Files**

1. **Go to Google Fonts:**
   - Inter: https://fonts.google.com/specimen/Inter
   - Roboto: https://fonts.google.com/specimen/Roboto

2. **Download Font Files:**
   - Click "Download family" for Inter
   - Click "Download family" for Roboto
   - Extract the ZIP files to get the .ttf files

3. **Select These Files:**
   ```
   Inter/
   ├── OFL.txt (license file)
   └── static/
       ├── Inter-Regular.ttf
       ├── Inter-Medium.ttf
       ├── Inter-SemiBold.ttf
       └── Inter-Bold.ttf

   Roboto/
   ├── Apache-2.0.txt (license file)
   └── static/
       ├── Roboto-Regular.ttf
       └── Roboto-Bold.ttf
   ```

### **📁 Step 2: Place Font Files**

1. **Navigate to your project:**
   ```
   d:\corpease\src\assets\fonts\
   ```

2. **Copy these files:**
   ```
   Inter-Regular.ttf
   Inter-Medium.ttf
   Inter-SemiBold.ttf
   Inter-Bold.ttf
   Roboto-Regular.ttf
   Roboto-Bold.ttf
   ```

3. **Remove placeholder files:**
   - Delete `Inter-Regular.txt`, `Inter-Bold.txt`, etc.

### **⚙️ Step 3: Configure Fonts in React Native**

#### **Option A: For React Native CLI (Recommended)**

1. **Install react-native.config.js** (if not exists):
   ```javascript
   // react-native.config.js
   module.exports = {
     project: {
       ios: {},
       android: {},
     },
     assets: ['./src/assets/fonts/'],
   };
   ```

2. **Link fonts:**
   ```bash
   npx react-native link
   ```

#### **Option B: For Expo Apps**

1. **Install expo-font:**
   ```bash
   expo install expo-font
   ```

2. **Configure in App.js:**
   ```javascript
   import { useFonts } from 'expo-font';

   export default function App() {
     const [fontsLoaded] = useFonts({
       'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
       'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
       'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
       'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
       'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
       'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
     });

     if (!fontsLoaded) {
       return null; // or a loading screen
     }

     return <YourApp />;
   }
   ```

### **🎨 Step 4: Use Fonts in Components**

#### **Using with Typography Component:**
```typescript
import { Typography } from '../components/common/Typography';

<Typography variant="h1" style={{ fontFamily: 'Inter-Bold' }}>
  Corpease
</Typography>

<Typography variant="body1" style={{ fontFamily: 'Inter-Regular' }}>
  Your body text here
</Typography>
```

#### **Using with Text Component:**
```typescript
import { Text } from 'react-native';

<Text style={{
  fontFamily: 'Inter-Bold',
  fontSize: 24,
  color: theme.colors.primary
}}>
  Corpease
</Text>
```

#### **Using with Theme System:**
```typescript
// In your theme config
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return {
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily: {
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semibold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
      },
    },
  };
};
```

### **🔧 Step 5: Font Configuration for Android**

1. **Create font directory in android:**
   ```
   android/app/src/main/assets/fonts/
   ```

2. **Copy font files there too:**
   ```
   android/app/src/main/assets/fonts/
   ├── Inter-Regular.ttf
   ├── Inter-Bold.ttf
   └── Roboto-Regular.ttf
   ```

### **📱 Step 6: Font Configuration for iOS**

1. **Add fonts to iOS project:**
   - Open `ios/Corpease.xcodeproj` in Xcode
   - Add font files to the project
   - Add to "Fonts provided by application" in Info.plist

2. **Update Info.plist:**
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>Inter-Regular.ttf</string>
     <string>Inter-Bold.ttf</string>
     <string>Roboto-Regular.ttf</string>
   </array>
   ```

### **✅ Step 7: Verify Installation**

1. **Test in your app:**
   ```typescript
   import { Text } from 'react-native';

   <Text style={{ fontFamily: 'Inter-Bold', fontSize: 20 }}>
     This should be Inter Bold
   </Text>

   <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>
     This should be Roboto Regular
   </Text>
   ```

2. **Check console for errors:**
   - No font errors = success!
   - Font errors = check file paths

### **🎯 Font Usage Examples:**

#### **In Headers:**
```typescript
<HeaderText level={1} style={{ fontFamily: 'Inter-Bold' }}>
  Welcome to Corpease
</HeaderText>
```

#### **In Buttons:**
```typescript
<Button title="Get Started" style={{ fontFamily: 'Inter-SemiBold' }} />
```

#### **In Body Text:**
```typescript
<Typography variant="body1" style={{ fontFamily: 'Inter-Regular' }}>
  Enjoy your shopping experience with Corpease
</Typography>
```

### **🚨 Common Issues & Solutions:**

1. **"Font file not found"**
   - Check file paths
   - Ensure files are in correct directory

2. **"Font not loading"**
   - Clear metro cache: `npx react-native start --reset-cache`
   - Rebuild app

3. **"Font not displaying"**
   - Check font family name spelling
   - Ensure font supports the characters you're using

### **📋 Summary:**

1. ✅ Download Inter & Roboto font families
2. ✅ Place .ttf files in `src/assets/fonts/`
3. ✅ Configure linking (react-native.config.js or expo-font)
4. ✅ Use fontFamily in style props
5. ✅ Test in your components

**Now your Corpease app will have beautiful, consistent typography!** 🎨✨
