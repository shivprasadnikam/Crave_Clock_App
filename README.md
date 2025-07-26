# 🍽️ Crave Clock - Employee Food Ordering App

A React Native food ordering application designed to **save employee time** by allowing them to browse restaurant menus, place orders, and make dining decisions without physically visiting restaurants.

## 🎯 **Mission Statement**

**Goal**: Save employee time by eliminating the need to physically visit restaurants to check menus and decide where to eat.

**Problem Solved**: Employees often waste time walking to different restaurants to check menus, wait in lines, and make dining decisions. Crave Clock provides instant access to all restaurant menus and ordering capabilities from their mobile device.

## 🚀 **Key Benefits for Employees**

### ⏰ **Time Savings**

- **No more walking to restaurants** to check menus
- **Instant menu access** from anywhere in the office
- **Quick decision making** with all options visible
- **Pre-order and skip lines** at restaurants

### 🍕 **Convenience Features**

- **Browse all nearby restaurants** in one app
- **View complete menus** with prices and descriptions
- **Real-time menu updates** without visiting restaurants
- **Order ahead** to avoid waiting in queues

### 💼 **Workplace Efficiency**

- **Faster lunch breaks** - more time for work or rest
- **Reduced decision fatigue** with organized restaurant options
- **Group ordering** capabilities for team lunches
- **Order tracking** to know exactly when food is ready

## 🛠️ Features

### 🔐 **Employee Authentication**

- Secure employee login and registration
- Company profile management
- Employee-specific preferences

### 🏪 **Restaurant Discovery**

- Browse all available restaurants
- View complete menus with prices
- Search and filter by cuisine type
- Restaurant ratings and reviews from colleagues

### 🛒 **Smart Ordering**

- Add/remove items from cart
- Real-time cart updates
- Quantity management
- Order customization options

### 💳 **Seamless Payment**

- UPI payment integration
- Secure payment processing
- Order confirmation
- Payment status tracking

### 📱 **Employee Experience**

- Intuitive bottom tab navigation
- Order history and tracking
- Push notifications for order updates
- Quick reordering from favorites

## 🏢 **Perfect for Office Environments**

### **Corporate Benefits**

- **Increased productivity** - employees spend less time on lunch decisions
- **Better time management** - predictable lunch schedules
- **Reduced restaurant crowding** - staggered ordering
- **Employee satisfaction** - more food options and convenience

### **Restaurant Benefits**

- **Reduced peak-hour stress** - orders spread throughout the day
- **Better inventory management** - advance order preparation
- **Increased customer satisfaction** - no waiting in lines
- **Higher order volumes** - easier ordering process

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Backend**: Java Spring Boot (deployed on Render)
- **Build Tool**: EAS Build
- **Notifications**: Expo Notifications

## 📱 Screens

- **Authentication**: Employee login, registration
- **Home**: Restaurant listing, search, favorites
- **Restaurant Detail**: Complete menu with prices, add to cart
- **Cart**: Order management, customization
- **Payment**: Secure UPI payment processing
- **Orders**: Order history, status tracking, reordering
- **Profile**: Employee profile, preferences, order history

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Crave_Clock_Client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Expo CLI globally**

   ```bash
   npm install -g @expo/cli
   ```

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Install Expo Go app on your device
   - Scan the QR code from the terminal
   - Or press 'a' for Android emulator, 'i' for iOS simulator

## 🔧 Configuration

### Environment Setup

The app connects to a Spring Boot backend deployed on Render:

- **Base URL**: `https://crave-clock-portal.onrender.com`
- **API Endpoints**: Configured in `services/api.js`

### App Configuration

- **Package Name**: `com.craveclock.app`
- **Expo SDK**: 53.0.20
- **Platforms**: Android, iOS, Web

## 📦 Building for Production

### Android APK (for employee distribution)

```bash
npx eas build -p android --profile preview
```

### Android App Bundle (for Play Store)

```bash
npx eas build -p android --profile production
```

### iOS IPA (requires Apple Developer account)

```bash
npx eas build -p ios --profile production
```

## 🏗️ Project Structure

```
Crave_Clock_Client/
├── assets/                 # App icons and images
├── components/             # Reusable UI components
│   ├── CartItem.js
│   └── FoodCard.js
├── context/               # React Context providers
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── NotificationContext.js
├── hooks/                 # Custom React hooks
│   └── useCart.js
├── navigation/            # Navigation configuration
│   └── AppNavigator.js
├── screens/               # App screens
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── HomeScreen.js
│   ├── RestaurantDetailScreen.js
│   ├── CartScreen.js
│   ├── CheckoutScreen.js
│   ├── PaymentScreen.js
│   ├── OrderHistoryScreen.js
│   ├── ProfileScreen.js
│   └── OrderConfirmation.js
├── services/              # API services
│   └── api.js
├── styles/                # Global styles
│   └── globalStyles.js
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies
└── README.md
```

## 🔌 API Integration

### Authentication Endpoints

- `POST /api/login` - Employee login
- `POST /api/onBoardUser` - Employee registration

### Restaurant Endpoints

- `GET /api/restaurants` - Get all available restaurants
- `GET /api/restaurants/{id}` - Get restaurant details and menu
- `GET /api/restaurants/{id}/menu` - Get complete menu with prices

### Cart Endpoints

- `GET /api/cart/{userId}` - Get employee's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/clear/{userId}` - Clear cart

### Order Endpoints

- `POST /api/orders` - Place order
- `GET /api/orders/user/{userId}` - Get employee's order history
- `GET /api/orders/{orderId}` - Get order details and status

### Payment Endpoints

- `POST /api/payment/initiate` - Initiate UPI payment
- `GET /api/payment/status/{paymentId}` - Check payment status

## 🐛 Debugging

### Development Mode

```bash
npx expo start
```

### Debug Features

- **Console Logs**: View in terminal or Expo Go "Show Logs"
- **Network Requests**: Monitored with Axios interceptors
- **React Native Debugger**: Available in Expo Go developer menu

### Common Issues

- **Navigation Issues**: Check React Navigation dependencies
- **API Errors**: Verify backend URL and network connectivity
- **Build Errors**: Clear cache with `--clear-cache` flag

## 📱 Platform Support

- ✅ **Android**: Fully supported for employee devices
- ✅ **iOS**: Fully supported for employee devices
- ✅ **Web**: Basic support (development only)
- ✅ **Expo Go**: Development and testing

## 🔒 Security Features

- JWT token authentication for employees
- Secure API communication
- Input validation and sanitization
- Error handling and logging

## 📈 Performance & Efficiency

- **Fast loading** - Quick restaurant and menu access
- **Efficient state management** - Smooth user experience
- **Minimal re-renders** - Responsive interface
- **Lazy loading** - Optimized for mobile performance

## 🏢 **Deployment for Companies**

### **Employee Distribution**

- **Internal APK distribution** - Share APK directly with employees
- **Company Play Store** - Upload to Google Play for easy installation
- **QR Code sharing** - Quick installation via Expo Go during setup

### **Restaurant Integration**

- **Restaurant onboarding** - Easy setup for new restaurants
- **Menu management** - Real-time menu updates
- **Order management** - Streamlined order processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Backend**: Java Spring Boot  
**Frontend**: React Native with Expo  
**Deployment**: Render (Backend), EAS Build (Mobile)

## 📞 Support

For support and questions:

- Check the debugging section above
- Review API documentation
- Test in Expo Go development mode

---

## 🎯 **Success Metrics**

- **Time Saved**: Employees save 10-15 minutes per lunch break
- **Productivity**: Increased work time due to faster lunch decisions
- **Satisfaction**: Higher employee satisfaction with food options
- **Efficiency**: Reduced restaurant crowding and wait times

---

**Empowering employees to make better dining decisions, faster! 🚀**
