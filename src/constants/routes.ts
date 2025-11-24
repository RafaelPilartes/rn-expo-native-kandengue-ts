const ROUTES = {
  AuthStack: {
    LANG: 'LangScreen',
    ONBOARDING: 'OnboardingScreen',
    PERMISSIONS: 'PermissionsScreen',
    WELCOME: 'WelcomeScreen',
    SIGN_IN: 'SignInScreen',
    SIGN_UP: 'SignUpScreen',

    SMS_VERIFICATION: 'SmsVerificationScreen',
    VERIFICATION_SUCCESS: 'VerificationSuccessScreen',
    CREATE_PASSWORD: 'CreatePasswordScreen',
    FORGOT_PASSWORD: 'ForgotPasswordScreen',
    FORGOT_PASSWORD_SUCCESS: 'ForgotPasswordSuccessScreen',
    NEW_PASSWORD: 'NewPasswordScreen',
    NEW_PASSWORD_SUCCESS: 'NewPasswordSuccessScreen',

    CAMOUFLAGE: 'CamouflageScreen',
  },
  HomeStack: {
    HOME: 'HomeScreen',
    NOTIFICATIONS: 'NotificationsScreen',
  },
  HistoryStack: {
    HISTORY: 'HistoryScreen',
  },
  ProfileStack: {
    PROFILE: 'ProfileScreen',
    EDIT: 'EditProfileScreen',
    VEHICLES: 'VehiclesScreen',
    DOCUMENTS: 'DocumentsScreen',
    WALLET: 'WalletScreen',
    ABOUT: 'AboutScreen',
    FAQ: 'FaqScreen',
    COMPLAINTS: 'ComplaintsScreen',
    HELP: 'HelpScreen',
    PRIVATE: 'PrivacyPolicyScreen',
    TERMS: 'TermsConditionsScreen',
  },
  MotoBoyStack: {
    REQUESTS: 'RequestsScreen',
    TRANSFERS: 'TransfersScreen',
  },
  Rides: {
    HOME: 'RideHomeScreen',
    CHOOSE: 'RideChooseScreen',
    SUMMARY: 'RideSummaryScreen',
    FINISHED: 'RideFinishedScreen',
    REQUESTS: 'RequestsScreen',
    TRANSFERS: 'TransfersScreen',
  },
  MainTab: {
    HOME: 'HomeTab',
    MAP: 'MapTab',
    HISTORY: 'HistoryTab',
    PROFILE: 'ProfileTab',
  },
} as const;

export default ROUTES;
