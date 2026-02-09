# Architectural Changes Specification (Pro App Reference)

This document details the architectural structure, new dependencies, and core logic implemented in the **Kandengue Pro** app since Jan 26, 2026. Use this as a blueprint for updating the **Kandengue Atrevido (Passenger)** app.

## 1. New Dependencies & Configuration

### [package.json](file:///c:/_Projects/react_native/RnNativeKandengueProTs/package.json)

Add or update these specific versions:

```json
"dependencies": {
  "expo-maps": "~0.12.10",             // Replaces react-native-maps
  "expo-location": "~19.0.7",          // Core location services
  "expo-task-manager": "~14.0.9",      // Background tasks
  "nativewind": "^4.2.1",              // Styling
  "react-native-reanimated": "~4.1.1", // Animations (Alerts/UI)
  "lucide-react-native": "^0.555.0",   // Icons
  "react-native-keychain": "^10.0.0",  // Secure storage
  "@mapbox/polyline": "^1.2.1"         // Route decoding
}
```

### [app.json](file:///c:/_Projects/react_native/RnNativeKandengueProTs/app.json) configuration

**Plugins:**

```json
"plugins": [
  "expo-maps",
  [
    "expo-build-properties",
    {
      "ios": { "deploymentTarget": "15.1" },
      "android": {
        "compileSdkVersion": 35,
        "targetSdkVersion": 35,
        "buildToolsVersion": "35.0.0"
      }
    }
  ]
]
```

---

## 2. Directory Structure & Key Files

The following new files and directories were established. **Replicate this structure.**

```text
src/
├── context/
│   ├── LocationContext.tsx       # Core location logic (Permission + Tracking)
│   ├── AlertContext.tsx          # New custom alert provider
│   └── AppContext.tsx            # Global app state wrapper
├── providers/
│   ├── MapProvider.tsx           # Wrapper for MapView logic
│   └── AppProvider.tsx           # Combines all providers
├── components/
│   ├── ui/
│   │   └── CustomAlert.tsx       # Reanimated Modal Component
│   ├── map/
│   │   └── MapView.tsx           # Platform-specific map export
│   └── PageHeader.tsx            # Standardized Header
├── services/
│   ├── location/
│   │   └── BackgroundLocationTask.ts # Background tracking task
│   └── google/
│   │   └── googleApi.ts          # Geocoding/Places API
└── types/
    ├── map.ts                    # Map interfaces
    └── trackingTypes.ts          # Tracking modes definitions
```

---

## 3. Core Logic Implementation

### A. Location Context ([src/context/LocationContext.tsx](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx))

**Concept:** Single source of truth for location, supporting different "Modes".

**Types ([src/types/trackingTypes.ts](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/types/trackingTypes.ts)):**

```typescript
export type TrackingMode = 'OFFLINE' | 'INVISIBLE' | 'AVAILABILITY' | 'RIDE'
// *Passenger App Note: 'RIDE' mode should be active if `activeRides.length > 0`. Tracking might need to cover multiple simultaneous active rides or just the user's current location relative to them.*
```

**Key Interfaces:**

- [triggerPermissionFlow()](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx#93-97): Opens a disclosure modal before requesting system permissions.
- [startTracking(mode)](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx#335-388): Configures precision/frequency based on mode.
- [stopTracking()](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx#389-416): Cleans up watchers and background tasks.

**Background Task (`BACKGROUND_LOCATION_TASK`):**

- Defined in [src/services/location/BackgroundLocationTask.ts](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/services/location/BackgroundLocationTask.ts).
- Uses `expo-task-manager`.
- **Logic Difference**:
  - **Pro (Driver)**: Checks `currentMissionId` (Single active mission).
  - **Passenger**: Checks `activeRides` (Array). User may have multiple active rides. Tracking logic should verify if _any_ ride is in progress to enable `RIDE` mode.

### B. Map Provider ([src/providers/MapProvider.tsx](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/providers/MapProvider.tsx))

**Concept:** Decouples MapView refs and state from screens.

- **State**: `location`, `address`, `isTracking`.
- **Methods**: [centerOnUser()](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/screens/Rides/RideSummary.tsx#58-76), [startTracking()](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx#335-388).
- **Usage**: Screens consume [useMap()](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/providers/MapProvider.tsx#229-230) to control the map without direct ref manipulation.

### C. Custom Alerts ([src/context/AlertContext.tsx](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/AlertContext.tsx))

**Why:** Native `Alert.alert` is blocking and ugly.
**Implementation:**

- **Context**: Stores `visible`, `title`, `message`, `type` ('success'|'error'|'warning'|'info'), and `buttons`.
- **Component**: `<CustomAlert />` sits at the root (in `AppProvider`).
- **Animation**: Uses `react-native-reanimated` (SharedValue for opacity/scale).

---

## 4. Feature Implementation Details

### Ride Summary Screen Refactor

The "Active Ride" screen is now componentized:

1.  **`RideMapContainer`**:
    - Pure map presentation.
    - Receives `routeCoords` (polyline), `driverLocation`, `pickup/dropoff` markers.
    - Handles camera updates when status changes (e.g., zoom to route).

2.  **`RideStatusManager`**:
    - Handles the "Business Logic" of the UI.
    - Displays differents views based on `rideStatus` ('driver_on_the_way', 'arrived', etc.).

3.  **`RideModals`**:
    - Contains `CancellationModal`, `ArrivalModal`, `OTPModal`.
    - Kept separate to clean up the main screen render.

### Network & Permissions

- **PermisisonBlocker**: A specific component shown when location/notification permissions are missing, blocking usage until resolved.
- **NetworkProvider**: Monitors `NetInfo` and shows a "Sem Conexão" banner if offline.

---

## 5. Action Plan for Passenger App

1.  **Update Config**: Apply [package.json](file:///c:/_Projects/react_native/RnNativeKandengueProTs/package.json) and [app.json](file:///c:/_Projects/react_native/RnNativeKandengueProTs/app.json) updates immediately.
2.  **Copy Types**: Create [src/types/trackingTypes.ts](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/types/trackingTypes.ts) and [map.ts](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/types/map.ts) (adapt modes for passenger).
3.  **Scaffold Services**: Setup `BackgroundLocationTask` (even if simple) and `googleApi`.
4.  **Implement Contexts**:
    - [AlertContext](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/AlertContext.tsx#19-24) (Copy verbatim).
    - [LocationContext](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/context/LocationContext.tsx#19-39) (Adapt: Passenger needs less aggressive tracking).
    - [MapProvider](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/providers/MapProvider.tsx#17-228) (Copy methodology).
5.  **Replace Components**:
    - Install [CustomAlert](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/components/ui/CustomAlert.tsx#29-166) at root.
    - Replace all `Alert.alert` calls.
6.  **Refactor Map**: Switch to `expo-maps` using the [MapProvider](file:///c:/_Projects/react_native/RnNativeKandengueProTs/src/providers/MapProvider.tsx#17-228) pattern.
