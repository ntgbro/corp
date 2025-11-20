# CorpEase - Food Delivery App

CorpEase is a comprehensive food delivery application built with React Native and Firebase.

## Features

- User authentication (Phone, Email, Google)
- Restaurant browsing and menu exploration
- Cart management and checkout
- Order tracking and history
- Real-time notifications
- Location-based services
- Payment integration (PhonePe, Cash on Delivery)

## Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio / Xcode
- Firebase account
- PhonePe merchant account (for payment integration)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd corpease
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up Firebase:
   - Create a Firebase project
   - Download the `google-services.json` file (Android) and `GoogleService-Info.plist` file (iOS)
   - Place them in the appropriate directories

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your actual configuration

## PhonePe Payment Gateway Configuration

For detailed instructions on configuring PhonePe payment gateway, please refer to [PHONEPE_CONFIGURATION.md](PHONEPE_CONFIGURATION.md).

To get started quickly:

1. Update the IP address in your `.env` file:
   ```
   PHONEPE_BACKEND_URL=http://YOUR_COMPUTER_IP:3001
   ```

2. Add your PhonePe credentials to the `.env` file:
   ```
   PHONEPE_MERCHANT_ID=your_merchant_id_here
   PHONEPE_SALT=your_secret_key_here
   PHONEPE_SALT_INDEX=your_salt_index_here
   ```

3. Find your computer's IP address:
   - Windows: Run `ipconfig` and look for "IPv4 Address"
   - Mac/Linux: Run `ifconfig` or `ip addr show`

4. Make sure your mobile device and computer are on the same network

5. Start the PhonePe backend:
   ```bash
   yarn phonepe-backend
   ```

## Running the App

### Android

```bash
yarn android
```

### iOS

```bash
yarn ios
```

## Development Scripts

- `yarn start`: Start the Metro bundler
- `yarn seed`: Seed the database with sample data
- `yarn phonepe-backend`: Start the PhonePe backend service
- `yarn test`: Run tests

## Project Structure

```
src/
├── components/        # Reusable UI components
├── config/            # Configuration files
├── contexts/          # React contexts
├── features/          # Feature modules
├── hooks/             # Custom hooks
├── navigation/        # Navigation setup
├── screens/           # Screen components
├── scripts/           # Utility scripts
├── services/          # Service integrations
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.