# 📚 L'Atelier d'Étude — Guide d'installation

Application de devoirs pour collège avec génération de quiz par IA depuis une photo.

---

## 🎯 Vue d'ensemble du processus

```
[1] Compte GitHub  →  [2] Compte Vercel  →  [3] Clé API Claude  →  [4] PWABuilder  →  [5] APK Android
     (5 min)            (5 min)              (5 min)              (5 min)            (5 min)
```

**Temps total : environ 30 minutes.**

---

## 📋 Étape 1 — Créer un compte GitHub

GitHub va héberger le code source de l'application.

1. Allez sur **https://github.com/signup**
2. Créez un compte gratuit avec votre email
3. Vérifiez votre email

---

## 📤 Étape 2 — Mettre le projet sur GitHub

**Méthode simple par l'interface web (sans ligne de commande) :**

1. Une fois connecté à GitHub, cliquez sur le **+** en haut à droite → **New repository**
2. Nom du dépôt : `atelier-etude`
3. Cochez **Public** (c'est plus simple, le code n'est pas sensible)
4. Cliquez **Create repository**
5. Sur la page suivante, cliquez sur **uploading an existing file**
6. **Glissez-déposez TOUS les fichiers** du dossier `atelier-etude` (sauf `node_modules` s'il existe)
7. Tout en bas, cliquez **Commit changes**

---

## 🚀 Étape 3 — Déployer sur Vercel

Vercel transforme le code GitHub en site web accessible en ligne.

1. Allez sur **https://vercel.com/signup**
2. Cliquez sur **Continue with GitHub** (connexion via votre compte GitHub)
3. Autorisez Vercel à accéder à vos dépôts
4. Sur le tableau de bord, cliquez **Add New...** → **Project**
5. Trouvez `atelier-etude` dans la liste, cliquez **Import**
6. **NE CHANGEZ RIEN** dans les paramètres (Vercel détecte automatiquement Vite)
7. **AVANT de cliquer Deploy**, allez dans **Environment Variables** et ajoutez :
   - **Key** : `ANTHROPIC_API_KEY`
   - **Value** : (votre clé API Claude — voir étape 4 ci-dessous)
8. Cliquez **Deploy**
9. Attendez 1-2 minutes ⏳
10. Vous obtenez une URL du type **`atelier-etude-xxx.vercel.app`** → notez-la !

---

## 🔑 Étape 4 — Obtenir une clé API Claude

C'est nécessaire pour la fonction "photo → quiz par IA".

1. Allez sur **https://console.anthropic.com**
2. Créez un compte
3. Ajoutez une carte bancaire (l'API est payante, mais très peu chère : environ **0,01 € par quiz généré**)
4. Allez dans **Settings → API Keys**
5. Cliquez **Create Key**, donnez-lui un nom (ex: "atelier-etude")
6. **COPIEZ LA CLÉ IMMÉDIATEMENT** (elle ne sera plus visible ensuite)
7. Retournez sur Vercel, collez cette clé dans la variable d'environnement `ANTHROPIC_API_KEY`
8. Redéployez : sur Vercel, allez dans **Deployments** → cliquez les 3 points du dernier déploiement → **Redeploy**

💡 **Astuce économie** : Anthropic offre souvent 5 $ de crédit gratuit à l'inscription, ce qui équivaut à environ 500 quiz générés.

---

## 📱 Étape 5 — Tester avant l'APK

**Important** : avant de fabriquer l'APK, testez que tout marche !

1. Sur votre téléphone Android, ouvrez Chrome
2. Allez sur l'URL Vercel obtenue à l'étape 3
3. L'app doit se charger normalement
4. Activez le mode parent, créez un devoir test avec une photo, vérifiez que l'IA génère bien un quiz
5. Si tout marche, on passe à l'APK !

**🎉 À ce stade, vous pouvez déjà ajouter l'app à l'écran d'accueil :**
- Chrome → menu (3 points) → **Ajouter à l'écran d'accueil**
- C'est suffisant pour la plupart des usages !

---

## 📦 Étape 6 — Fabriquer l'APK avec PWABuilder

Si vous voulez vraiment un fichier `.apk` installable :

1. Allez sur **https://www.pwabuilder.com**
2. Collez votre URL Vercel dans la barre
3. Cliquez **Start**
4. PWABuilder analyse l'app (quelques secondes)
5. En haut, vous voyez votre score PWA (devrait être bon ✅)
6. Cliquez **Package For Stores** → **Android**
7. Configuration recommandée :
   - **Package ID** : `com.votrenom.atelieretude`
   - **App name** : `L'Atelier d'Étude`
   - **Signing key** : laissez **"New"** (PWABuilder en génère une)
   - ⚠️ **Téléchargez et SAUVEGARDEZ la clé de signature** dans un endroit sûr (vous en aurez besoin pour les futures mises à jour)
8. Cliquez **Generate** → téléchargez le ZIP
9. Décompressez le ZIP : vous trouvez un fichier `app-release-signed.apk`

---

## 📲 Étape 7 — Installer l'APK sur Android

1. Transférez le `.apk` sur le téléphone/tablette (par email, USB, Google Drive, etc.)
2. Sur Android, ouvrez le fichier
3. Si demandé, autorisez **"Sources inconnues"** ou **"Installer des applications inconnues"** dans les paramètres
4. Suivez l'installation
5. ✨ L'app apparaît dans le tiroir d'applications !

---

## 🔄 Mises à jour futures

**Avantage majeur de cette méthode** : pour modifier l'app (ajouter une matière, corriger un bug...) :

1. Modifiez les fichiers sur GitHub (interface web ou via VS Code)
2. Vercel redéploie automatiquement en 1 minute
3. **Les utilisateurs reçoivent la mise à jour automatiquement** au prochain lancement
4. Pas besoin de refaire l'APK !

---

## ❓ En cas de problème

- **L'app affiche un écran blanc** : vérifiez que le déploiement Vercel s'est bien terminé (pastille verte)
- **La génération de quiz ne marche pas** : vérifiez que la variable `ANTHROPIC_API_KEY` est bien définie dans Vercel et que vous avez redéployé après l'avoir ajoutée
- **L'APK refuse de s'installer** : autorisez les sources inconnues dans Paramètres Android > Sécurité

---

## 💰 Coûts récapitulatifs

| Service | Coût |
|---|---|
| GitHub | Gratuit |
| Vercel | Gratuit (largement suffisant pour usage familial) |
| API Claude | ~0,01 € par quiz généré (5 $ offerts à l'inscription) |
| PWABuilder | Gratuit |
| **Total mensuel** | **~1-2 € maximum** selon utilisation |

Bonne installation ! 🎓
