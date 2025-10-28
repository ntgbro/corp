## Lottie Animation Setup Guide for Corpease

### **📦 Step 1: Install Lottie Library**

#### **For React Native CLI:**
```bash
npm install lottie-react-native
cd ios && pod install
```

#### **For Expo Apps:**
```bash
expo install lottie-react-native
```

### **🎬 Step 2: Animation Files Ready**

Your animation files are already in:
```
src/assets/animations/
├── loading.json          # Generic loading spinner
├── order_complete.json   # Success animation for orders
├── empty_cart.json       # Empty cart state animation
├── success_check.json    # Generic success checkmark
└── error.json           # Error state animation
```

### **⚡ Step 3: Use Animations in Components**

#### **Basic Usage:**
```typescript
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

const LoadingAnimation = () => (
  <LottieView
    source={require('../assets/animations/loading.json')}
    autoPlay
    loop
    style={{ width: 200, height: 200 }}
  />
);
```

#### **Advanced Usage with Controls:**
```typescript
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

const AnimatedButton = () => {
  const animation = useRef<LottieView>(null);

  const playAnimation = () => {
    animation.current?.play();
  };

  return (
    <LottieView
      ref={animation}
      source={require('../assets/animations/success_check.json')}
      autoPlay={false}
      loop={false}
      style={{ width: 100, height: 100 }}
      onAnimationFinish={() => console.log('Animation finished!')}
    />
  );
};
```

### **🎯 Step 4: Animation Examples**

#### **Loading Spinner:**
```typescript
import { Loader } from '../components/common/Loader';

<Loader source={require('../assets/animations/loading.json')} />
```

#### **Order Success:**
```typescript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('../assets/animations/order_complete.json')}
  autoPlay
  loop={false}
  style={{ width: 150, height: 150 }}
/>
```

#### **Empty State:**
```typescript
import { EmptyState } from '../components/common/EmptyState';

<EmptyState
  icon={
    <LottieView
      source={require('../assets/animations/empty_cart.json')}
      autoPlay
      loop
      style={{ width: 120, height: 120 }}
    />
  }
  title="Your cart is empty"
  description="Add some items to get started"
/>
```

#### **Success Feedback:**
```typescript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('../assets/animations/success_check.json')}
  autoPlay
  loop={false}
  style={{ width: 80, height: 80 }}
/>
```

#### **Error State:**
```typescript
import LottieView from 'lottie-react-native';

<LottieView
  source={require('../assets/animations/error.json')}
  autoPlay
  loop={false}
  style={{ width: 100, height: 100 }}
/>
```

### **⚙️ Step 5: Animation Props Reference**

#### **Common Props:**
```typescript
<LottieView
  source={require('../assets/animations/loading.json')}
  autoPlay={true}           // Start automatically
  loop={true}              // Loop animation
  style={{ width: 200, height: 200 }}
  speed={1.0}              // Playback speed
  progress={0.5}           // Start from middle
  onAnimationFinish={() => console.log('Finished!')}
/>
```

#### **Control Methods:**
```typescript
const animation = useRef<LottieView>(null);

// Play animation
animation.current?.play();

// Pause animation
animation.current?.pause();

// Reset animation
animation.current?.reset();

// Play from specific frame
animation.current?.play(30, 60); // from frame 30 to 60
```

### **🎨 Step 6: Customizing Animations**

#### **Color Replacement:**
```typescript
<LottieView
  source={require('../assets/animations/success_check.json')}
  autoPlay
  loop={false}
  style={{ width: 100, height: 100 }}
  colorFilters={[
    {
      keypath: 'Checkmark', // Layer name in animation
      color: '#007AFF',     // New color
    },
  ]}
/>
```

#### **Speed Control:**
```typescript
<LottieView
  source={require('../assets/animations/loading.json')}
  autoPlay
  loop
  speed={2.0} // Double speed
  style={{ width: 100, height: 100 }}
/>
```

#### **Size Control:**
```typescript
<LottieView
  source={require('../assets/animations/loading.json')}
  autoPlay
  loop
  style={{
    width: 50,
    height: 50,
    transform: [{ scale: 2 }] // Scale up
  }}
/>
```

### **📱 Step 7: Performance Optimization**

#### **Memory Management:**
```typescript
useEffect(() => {
  return () => {
    // Clean up animation when component unmounts
  };
}, []);
```

#### **Conditional Rendering:**
```typescript
const [showAnimation, setShowAnimation] = useState(false);

{showAnimation && (
  <LottieView
    source={require('../assets/animations/success_check.json')}
    autoPlay
    loop={false}
    onAnimationFinish={() => setShowAnimation(false)}
  />
)}
```

### **🚀 Step 8: Integration with Components**

#### **Enhanced Loader Component:**
```typescript
import LottieView from 'lottie-react-native';

export const Loader = ({ source, size = 100 }) => (
  <LottieView
    source={source || require('../assets/animations/loading.json')}
    autoPlay
    loop
    style={{ width: size, height: size }}
  />
);
```

#### **Animated Button:**
```typescript
const AnimatedButton = ({ onPress, children }) => {
  const animation = useRef<LottieView>(null);

  const handlePress = () => {
    animation.current?.play();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LottieView
        ref={animation}
        source={require('../assets/animations/success_check.json')}
        autoPlay={false}
        loop={false}
        style={{ width: 50, height: 50 }}
      />
      {children}
    </TouchableOpacity>
  );
};
```

### **🔧 Troubleshooting**

#### **"Animation not showing"**
- Check file path is correct
- Ensure Lottie is properly installed
- Clear metro cache

#### **"Animation slow/laggy"**
- Reduce animation complexity
- Use smaller dimensions
- Enable hardware acceleration

#### **"Animation not loading"**
- Check JSON file is valid
- Ensure file exists in correct location
- Check for syntax errors in JSON

### **📋 Animation Usage Summary:**

✅ **5 Ready-to-use animations** created  
✅ **Loading, Success, Error, Empty states** covered  
✅ **Easy integration** with existing components  
✅ **Performance optimized** for mobile  
✅ **Customizable** colors and sizes  

**Your Corpease app now has beautiful, smooth animations!** 🎬✨
