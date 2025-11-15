# 📱 Monthly Finance Tracker - React Native Mobile App

## Setup Guide - APK Configuration

Ce guide te montrera comment créer une app Android native (APK) pour **Monthly Finance Tracker** en utilisant **React Native + Expo**.

---

## **✅ Prérequis**

1. **Node.js** (v16+) - https://nodejs.org/
2. **npm** ou **yarn**
3. **Java Development Kit (JDK)** - https://www.oracle.com/java/technologies/downloads/
4. **Android SDK** - https://developer.android.com/studio
5. **Compte Expo** (gratuit) - https://expo.dev/signup

---

## **Step 1: Installation initiale**

### 1.1 Clone la branche react-native-mobile
```bash
git clone -b react-native-mobile https://github.com/skillmasteracademy2-cpu/my-apps.git
cd my-apps/mobile
```

### 1.2 Installe les dépendances
```bash
npm install
# ou
yarn install
```

### 1.3 Installe Expo CLI globalement
```bash
npm install -g expo-cli
```

---

## **Step 2: Structure du projet**

Une fois `npm install` terminé, la structure sera :
```
mobile/
├── package.json
├── app.json
├── App.js (ou App.tsx)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── TransactionScreen.js
│   │   ├── ReportScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── TransactionForm.js
│   │   ├── TransactionList.js
│   │   └── Chart.js
│   ├── store/
│   │   └── financeStore.js (Zustand)
│   ├── utils/
│   │   ├── storage.js (AsyncStorage)
│   │   └── calculations.js
│   └── navigation/
│       └── BottomTabNavigator.js
├── android/ (généré automatiquement)
└── ios/ (généré automatiquement)
```

---

## **Step 3: Tester localement**

### 3.1 Démarrer Expo
```bash
cd mobile
npm start
```

Tu verras un QR code dans le terminal.

### 3.2 Tester sur téléphone Android
- **Option A:** Installe l'app Expo sur Google Play Store
- **Option B:** Utilise un émulateur Android

Scanne le QR code avec l'app Expo → L'app se charge sur ton téléphone!

---

## **Step 4: Générer l'APK (Installation locale)**

### 4.1 Utiliser Expo pour générer l'APK
```bash
cd mobile
expo build:android -t apk
```

Expo va :
1. Te demander de te connecter/créer un compte
2. Compiler l'app
3. Générer un APK téléchargeable

### 4.2 Télécharger et installer l'APK
- Une fois la compilation terminée, tu recevras un lien de téléchargement
- Télécharge l'APK sur ton téléphone Android
- Installe-le directement (Settings → Security → Unknown Sources)

---

## **Step 5: Fonctionnalités mobiles incluses**

✅ **Gestion des transactions**
- Ajouter/Modifier/Supprimer des transactions
- Catégories et descriptions

✅ **Stockage offline**
- AsyncStorage pour sauvegarder localement
- Données persistent sur le téléphone

✅ **Notifications**
- Notifications locales pour les dépenses
- Alertes de dépassement de budget

✅ **Rapports et graphiques**
- Vue mensuelle des dépenses
- Graphiques par catégorie

✅ **Interface mobile optimisée**
- Navigation par onglets (Bottom Tab Navigation)
- Touch-friendly
- Dark/Light mode support

---

## **Step 6: Troubleshooting**

### Erreur: "Expo command not found"
```bash
npm install -g expo-cli
```

### L'app ne démarre pas
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm start
```

### Problème avec Android SDK
- Télécharge Android Studio: https://developer.android.com/studio
- Ouvre Android Studio et laisse-la télécharger les SDK automatiquement

---

## **Step 7: Fichiers à créer manuellement**

Après `npm install`, crée ces fichiers dans le dossier `mobile/`:

### **App.js**
```javascript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { initializeStorage } from './src/utils/storage';

export default function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
```

### **app.json** (Configuration Expo)
```json
{
  "expo": {
    "name": "Monthly Finance Tracker",
    "slug": "monthly-finance-tracker",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.skillmasteracademy.financetracker"
    }
  }
}
```

---

## **Step 8: Publier sur Google Play Store (Optionnel)**

Si tu veux distribuer ton app publiquement :

1. Crée un compte Google Play Developer ($25 one-time)
2. Génère une APK de production
3. Upload sur Google Play Console

---

## **Questions? Besoin d'aide?**

- 📚 **Docs React Native**: https://reactnative.dev/
- 📚 **Docs Expo**: https://docs.expo.dev/
- 🚀 **Expo Forum**: https://forums.expo.dev/

---

**Bon développement! 🎉**
