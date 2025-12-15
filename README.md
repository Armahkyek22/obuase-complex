# Classcope Parent App

A comprehensive React Native application designed for parents to monitor their children's academic progress, featuring real-time updates, secure authentication, and an intuitive interface.

## Key Features

- **Multi-Child Support**: Manage and monitor multiple children's academic profiles from a single account
- **Real-time Attendance Tracking**: View and receive updates on your child's school attendance
- **Grade Monitoring**: Access detailed academic performance reports and progress tracking
- **Assignment Management**: Stay on top of homework, projects, and upcoming deadlines
- **Secure Payments**: Integrated payment system for school fees and other expenses
- **Push Notifications**: Instant alerts for important updates and announcements
- **Responsive Design**: Optimized for both mobile and tablet devices
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: React Navigation (Stack, Tabs, Drawer)
- **State Management**: React Context API + Hooks
- **UI Components**:
  - React Native Paper
  - Expo Vector Icons
  - React Native Reanimated
  - React Native Calendars
- **Storage**: AsyncStorage for local data persistence
- **Networking**: Axios for API communication
- **Development**: Expo for cross-platform development

## Screenshots

![Parent Home](./mockups/Parent%20Home.png)
![Assignments](./mockups/Assignments.png)
![Attendance](./mockups/Attendance.png)
![Results](./mockups/Results.png)
![Profile](./mockups/Profile.png)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode (macOS only)
- For Android: Android Studio or Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/classcope-parent-app.git
   cd classcope-parent-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   API_BASE_URL=your_api_endpoint_here
   # Add other environment variables as needed
   ```

4. **Start the development server**
   ```bash
   # For development
   npm start
   
   # Platform specific
   npm run android    # Android
   npm run ios        # iOS (macOS only)
   npm run web        # Web
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Project Structure

```
src/
├── assets/          # Images, fonts, and other static files
├── components/      # Reusable UI components
│   ├── common/      # Shared components (buttons, inputs, etc.)
│   ├── ui/          # UI-specific components
│   └── ...
├── constants/       # App constants (colors, themes, etc.)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── ...
├── screens/         # Screen components
│   ├── auth/        # Authentication screens
│   ├── dashboard/   # Main app screens
│   └── ...
├── services/        # API and service layer
│   ├── api.ts       # API client configuration
│   └── ...
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and helpers
```

## Available Scripts

- `npm start` - Start the development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm test` - Run test suite
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - Check TypeScript types

## Configuration

The app uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
API_BASE_URL=your_api_endpoint_here
ENABLE_LOGGING=true
# Add other environment variables as needed
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the [GitHub repository](https://github.com/yourusername/classcope-parent-app/issues) or contact the development team.

---

<div align="center">
  Made with ❤️ by Classcope Team
</div>
