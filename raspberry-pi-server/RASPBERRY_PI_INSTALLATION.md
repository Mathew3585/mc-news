# 🥧 Guide complet d'installation sur Raspberry Pi 3B

Guide pas-à-pas pour installer le serveur d'actualités sur votre Raspberry Pi 3B.

---

## 📋 Ce dont vous avez besoin

- ✅ Raspberry Pi 3B
- ✅ Carte microSD (8GB minimum, 16GB recommandé)
- ✅ Alimentation USB pour le Pi
- ✅ Connexion Internet (câble Ethernet ou WiFi)
- ✅ Un ordinateur pour la configuration initiale
- ✅ Votre nom de domaine (pour Cloudflare Tunnel)

---

## 🚀 PARTIE 1 : Installer Raspberry Pi OS

### Étape 1 : Télécharger et installer Raspberry Pi Imager

1. Téléchargez **Raspberry Pi Imager** : https://www.raspberrypi.com/software/
2. Installez-le sur votre PC
3. Lancez Raspberry Pi Imager

### Étape 2 : Flasher la carte SD

1. Insérez votre carte microSD dans votre PC
2. Dans Raspberry Pi Imager :
   - **Choose Device** → Raspberry Pi 3
   - **Choose OS** → Raspberry Pi OS (64-bit) Lite (recommandé, sans interface graphique)
   - **Choose Storage** → Votre carte SD

3. **IMPORTANT** : Cliquez sur ⚙️ **Settings** (en bas à droite) :
   - ✅ Set hostname : `raspberry-news` (ou ce que vous voulez)
   - ✅ Enable SSH : **Cochez** avec authentification par mot de passe
   - ✅ Set username and password :
     - Username : `pi`
     - Password : **choisissez un mot de passe fort**
   - ✅ Configure wireless LAN (si vous utilisez WiFi) :
     - SSID : nom de votre WiFi
     - Password : mot de passe WiFi
     - Wireless LAN country : `FR`
   - ✅ Set locale settings :
     - Time zone : `Europe/Paris`
     - Keyboard layout : `fr`

4. Cliquez sur **SAVE** puis **YES** pour écrire sur la carte

5. Attendez que le flashage soit terminé (~5-10 minutes)

### Étape 3 : Démarrer le Raspberry Pi

1. Insérez la carte SD dans le Raspberry Pi
2. Branchez le câble Ethernet (ou assurez-vous que le WiFi est configuré)
3. Branchez l'alimentation
4. Attendez ~1-2 minutes que le Pi démarre

---

## 🔌 PARTIE 2 : Se connecter au Raspberry Pi

### Méthode 1 : Trouver l'adresse IP du Pi

**Option A - Via votre box Internet** :
1. Connectez-vous à votre box (192.168.1.1 ou 192.168.0.1)
2. Regardez les appareils connectés
3. Trouvez `raspberry-news` ou l'adresse MAC du Pi

**Option B - Via un scan réseau** :
```bash
# Sur Windows (PowerShell)
arp -a

# Cherchez une adresse avec "Raspberry" ou "B8:27:EB" (MAC du Pi 3)
```

### Méthode 2 : Se connecter en SSH

```bash
# Remplacez 192.168.1.X par l'IP de votre Pi
ssh pi@192.168.1.X

# Si vous avez configuré le hostname:
ssh pi@raspberry-news.local
```

Entrez le mot de passe que vous avez défini.

**Première connexion** : Si on vous demande de confirmer la clé SSH, tapez `yes`.

---

## ⚙️ PARTIE 3 : Configurer le Raspberry Pi

### Étape 1 : Mettre à jour le système

```bash
sudo apt update && sudo apt upgrade -y
```

⏱️ Cela peut prendre 10-15 minutes.

### Étape 2 : Installer Node.js

```bash
# Installer Node.js 20.x (version LTS recommandée)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # Devrait afficher v20.x.x
npm --version   # Devrait afficher 10.x.x
```

### Étape 3 : Installer Git

```bash
sudo apt install -y git
```

---

## 📦 PARTIE 4 : Déployer le serveur d'actualités

### Étape 1 : Transférer les fichiers sur le Pi

**Option A - Via SCP (depuis votre PC)** :

```bash
# Sur votre PC, dans le dossier du projet
scp -r raspberry-pi-server pi@192.168.1.X:~/
```

**Option B - Via Git (si vous avez push sur GitHub)** :

```bash
# Sur le Pi
cd ~
git clone https://github.com/votre-username/votre-repo.git
cd votre-repo/raspberry-pi-server
```

**Option C - Via clé USB** :
```bash
# Branchez la clé USB sur le Pi
sudo mount /dev/sda1 /mnt
cp -r /mnt/raspberry-pi-server ~/
sudo umount /mnt
```

### Étape 2 : Installer les dépendances backend

```bash
cd ~/raspberry-pi-server
npm install
```

⏱️ Cela peut prendre 5-10 minutes sur le Pi 3B.

### Étape 3 : Configurer les variables d'environnement

```bash
# Créer le fichier .env
nano .env
```

Copiez-collez ce contenu (modifiez les valeurs) :

```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$XuExample...  # Voir ci-dessous pour générer
JWT_SECRET=votre-secret-jwt-tres-securise-ici-changez-moi
```

**Pour générer un hash de mot de passe** :
```bash
node -e "console.log(require('bcryptjs').hashSync('VOTRE_MOT_DE_PASSE', 10))"
```

Copiez le hash généré et mettez-le dans `ADMIN_PASSWORD_HASH`.

Appuyez sur `Ctrl+X`, puis `Y`, puis `Entrée` pour sauvegarder.

### Étape 4 : Tester le serveur

```bash
npm start
```

Vous devriez voir :
```
╔════════════════════════════════════════╗
║   🚀 Serveur d'actualités démarré !    ║
╠════════════════════════════════════════╣
║   Port: 3000                           ║
...
```

**Testez depuis votre PC** : Ouvrez `http://192.168.1.X:3000/api/health`

Vous devriez voir : `{"status":"ok"...}`

Appuyez sur `Ctrl+C` pour arrêter le serveur.

---

## 🎨 PARTIE 5 : Construire l'interface admin React

### Étape 1 : Installer les dépendances React

```bash
cd ~/raspberry-pi-server/admin
npm install
```

⏱️ Cela peut prendre 10-15 minutes.

### Étape 2 : Construire l'app React

```bash
npm run build
```

⏱️ Cela peut prendre 5-10 minutes sur le Pi 3B.

Une fois terminé, vous aurez un dossier `build/` avec l'interface compilée.

### Étape 3 : Retourner au dossier racine

```bash
cd ~/raspberry-pi-server
```

---

## 🤖 PARTIE 6 : Configurer le démarrage automatique

Pour que le serveur démarre automatiquement au boot du Pi.

### Étape 1 : Installer PM2

```bash
sudo npm install -g pm2
```

### Étape 2 : Démarrer le serveur avec PM2

```bash
cd ~/raspberry-pi-server
pm2 start server.js --name "news-server"
```

### Étape 3 : Configurer le démarrage automatique

```bash
pm2 save
pm2 startup
```

PM2 va afficher une commande à copier-coller. **Exécutez cette commande**.

Exemple :
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pi --hp /home/pi
```

### Étape 4 : Vérifier que ça marche

```bash
# Redémarrer le Pi
sudo reboot

# Après redémarrage, reconnectez-vous en SSH et vérifiez :
pm2 status
```

Vous devriez voir `news-server` avec le statut `online`.

---

## 🌐 PARTIE 7 : Exposer sur Internet avec Cloudflare Tunnel

### Prérequis

- Avoir un nom de domaine (exemple : `losnachoschipies.fr` chez OVH)
- Un compte Cloudflare (gratuit)

### Étape 1 : Créer un compte Cloudflare et ajouter votre domaine

#### 1.1 Créer le compte

1. Allez sur https://cloudflare.com
2. Cliquez sur **Sign Up** (Inscription)
3. Créez un compte gratuit avec votre email
4. Vérifiez votre email

#### 1.2 Ajouter votre domaine à Cloudflare

1. Une fois connecté, cliquez sur **Add a Site** (Ajouter un site)
2. Entrez votre domaine : `losnachoschipies.fr`
3. Cliquez sur **Add site**
4. Choisissez le plan **Free** (gratuit)
5. Cliquez sur **Continue**

Cloudflare va scanner vos enregistrements DNS existants (~1-2 minutes).

#### 1.3 Changer les nameservers chez OVH

Cloudflare va vous donner **2 nameservers** comme :
```
adam.ns.cloudflare.com
noemi.ns.cloudflare.com
```

**Sur OVH** :

1. Connectez-vous à votre espace client OVH : https://www.ovh.com/manager/
2. Allez dans **Noms de domaine**
3. Cliquez sur `losnachoschipies.fr`
4. Onglet **Serveurs DNS**
5. Cliquez sur **Modifier les serveurs DNS**
6. Supprimez les serveurs DNS OVH par défaut
7. Ajoutez les 2 nameservers Cloudflare :
   - `adam.ns.cloudflare.com` (ou ceux que Cloudflare vous a donnés)
   - `noemi.ns.cloudflare.com`
8. Cliquez sur **Appliquer la configuration**

⏱️ **Attention** : La propagation DNS peut prendre **2 à 48 heures** (souvent 2-4h en pratique).

#### 1.4 Vérifier sur Cloudflare

Retournez sur Cloudflare et cliquez sur **Done, check nameservers**.

Cloudflare va vérifier. Si c'est bon, vous verrez un message de confirmation.

**Note** : Vous pouvez continuer même si ce n'est pas encore propagé, mais le tunnel ne fonctionnera qu'une fois la propagation terminée.

### Étape 2 : Installer cloudflared sur le Pi

```bash
# Télécharger cloudflared pour ARM
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm

# Rendre exécutable
chmod +x cloudflared-linux-arm
sudo mv cloudflared-linux-arm /usr/local/bin/cloudflared

# Vérifier
cloudflared --version
```

### Étape 3 : Se connecter à Cloudflare

```bash
cloudflared tunnel login
```

Cela va ouvrir une URL. Copiez l'URL et ouvrez-la dans un navigateur sur votre PC.

**IMPORTANT** : Si vous êtes en SSH, l'URL ne s'ouvrira pas automatiquement. Copiez le lien et ouvrez-le manuellement.

Connectez-vous et autorisez l'accès.

### Étape 4 : Créer un tunnel

```bash
cloudflared tunnel create news-server
```

Notez bien **l'ID du tunnel** qui s'affiche (exemple : `abc123-def456-...`).

### Étape 5 : Créer le fichier de configuration

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Collez ce contenu (modifiez `TUNNEL_ID` avec l'ID de votre tunnel) :

```yaml
tunnel: TUNNEL_ID
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: news.losnachoschipies.fr
    service: http://localhost:3000
  - service: http_status:404
```

**IMPORTANT** :
- Remplacez `TUNNEL_ID` par l'ID que vous avez noté à l'étape 4
- Le chemin est `/root/.cloudflared/` car vous êtes connecté en tant que `root`
- Le hostname est `news.losnachoschipies.fr` (votre sous-domaine)

Sauvegardez (`Ctrl+X`, `Y`, `Entrée`).

### Étape 6 : Créer l'enregistrement DNS pour le sous-domaine

```bash
cloudflared tunnel route dns news-server news.losnachoschipies.fr
```

Cette commande va automatiquement créer un enregistrement DNS `news.losnachoschipies.fr` dans Cloudflare qui pointe vers votre tunnel.

Vous devriez voir :
```
INFO: Successfully created DNS route for news-server over news.losnachoschipies.fr
```

### Étape 7 : Démarrer le tunnel

```bash
cloudflared tunnel run news-server
```

Vous devriez voir des logs comme :
```
INFO: Connection registered
INFO: Registered tunnel connection
```

**Testez depuis votre PC** : Ouvrez `https://news.losnachoschipies.fr/api/health` dans votre navigateur.

Vous devriez voir `{"status":"ok"...}` **avec HTTPS automatique** ! 🎉

**Si ça ne marche pas** : Attendez quelques minutes que la propagation DNS soit complète.

Une fois que ça fonctionne, appuyez sur `Ctrl+C` pour arrêter.

### Étape 8 : Configurer le démarrage automatique du tunnel

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

Vérifiez :
```bash
sudo systemctl status cloudflared
```

Devrait afficher `active (running)`.

---

## 🎉 PARTIE 8 : Configuration finale du launcher

### Dans votre launcher

Ouvrez [src/renderer/config/api.js](../../src/renderer/config/api.js) :

```javascript
export const API_CONFIG = {
  NEWS_API_URL: 'https://news.losnachoschipies.fr/api/news',
}
```

Sauvegardez et **recompilez votre launcher**.

**Testez** : Relancez votre launcher, les actualités devraient apparaître ! 🚀

### Accéder à l'interface admin

Ouvrez votre navigateur et allez sur :
```
https://news.losnachoschipies.fr
```

Vous verrez la page de connexion. Connectez-vous avec :
- **Username** : `admin`
- **Password** : celui que vous avez configuré dans `.env`

---

## 🔐 PARTIE 9 : Sécurité supplémentaire (Optionnel mais recommandé)

### Activer le mode "Under Attack" sur Cloudflare (en cas de besoin)

1. Allez sur votre dashboard Cloudflare
2. Sélectionnez `losnachoschipies.fr`
3. Onglet **Security** → **Settings**
4. Security Level : Mettez sur **Medium** ou **High**

### Limiter l'accès à l'interface admin (Optionnel)

Si vous voulez que seul vous puissiez accéder à l'admin :

1. Dans Cloudflare : **Security** → **WAF**
2. Créez une règle pour bloquer l'accès à `news.losnachoschipies.fr` sauf depuis votre IP

### Changer le mot de passe admin

Sur le Raspberry Pi :

```bash
cd ~/mc-news/raspberry-pi-server
nano .env
```

Générez un nouveau hash :
```bash
node -e "console.log(require('bcryptjs').hashSync('NOUVEAU_MOT_DE_PASSE', 10))"
```

Mettez le nouveau hash dans `.env` puis :
```bash
pm2 restart news-server
```

---

## 📊 Commandes utiles

### Gérer le serveur avec PM2

```bash
pm2 status              # Voir le statut
pm2 logs news-server    # Voir les logs
pm2 restart news-server # Redémarrer
pm2 stop news-server    # Arrêter
pm2 start news-server   # Démarrer
```

### Voir les logs du tunnel Cloudflare

```bash
sudo journalctl -u cloudflared -f
```

### Mettre à jour le serveur et le panel web depuis GitHub

**Méthode automatique (recommandée)** :

Un script de mise à jour automatique est fourni pour simplifier le processus :

```bash
cd ~/raspberry-pi-server
chmod +x update-from-github.sh
./update-from-github.sh
```

Ce script va automatiquement :
- ✅ Récupérer les dernières modifications depuis GitHub
- ✅ Vérifier les modifications locales et demander confirmation
- ✅ Mettre à jour les dépendances backend et frontend
- ✅ Reconstruire l'interface admin
- ✅ Redémarrer le serveur
- ✅ Afficher le statut et les logs

---

**Méthode manuelle** :

Si vous préférez faire les étapes manuellement :

```bash
# Se positionner dans le dossier du projet
cd ~/raspberry-pi-server

# Récupérer les dernières modifications depuis GitHub
git pull origin main

# Mettre à jour les dépendances backend si nécessaire
npm install

# Reconstruire l'interface admin React
cd admin
npm install  # Au cas où de nouvelles dépendances ont été ajoutées
npm run build

# Retourner au dossier racine
cd ..

# Redémarrer le serveur pour appliquer les changements
pm2 restart news-server

# Vérifier que tout fonctionne
pm2 status
pm2 logs news-server --lines 20
```

**Si vous avez modifié seulement l'interface admin (panel web)** :

```bash
cd ~/raspberry-pi-server/admin
git pull origin main
npm install
npm run build
cd ..
pm2 restart news-server
```

**Note** : Si vous obtenez des erreurs de conflits Git, le script automatique vous demandera confirmation avant d'écraser vos modifications. En manuel, vous pouvez forcer la mise à jour :
```bash
cd ~/raspberry-pi-server
git fetch origin
git reset --hard origin/main  # ATTENTION: cela écrase vos modifications locales !
npm install
cd admin && npm run build && cd ..
pm2 restart news-server
```

### Redémarrer le Raspberry Pi

```bash
sudo reboot
```

### Éteindre proprement le Raspberry Pi

```bash
sudo shutdown -h now
```

---

## 🛠️ Dépannage

### Le serveur ne démarre pas

```bash
cd ~/raspberry-pi-server
pm2 logs news-server
```

Regardez les erreurs dans les logs.

### Impossible de se connecter en SSH

- Vérifiez que le Pi est bien connecté au réseau
- Vérifiez l'IP avec `arp -a` sur votre PC
- Essayez `ssh pi@raspberry-news.local`

### L'interface admin ne s'affiche pas

```bash
cd ~/raspberry-pi-server/admin
ls build/  # Vérifiez que le dossier existe
```

Si `build/` n'existe pas, relancez `npm run build`.

### Cloudflare Tunnel ne fonctionne pas

```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f
```

Vérifiez que :
- L'ID du tunnel est correct dans `/etc/cloudflared/config.yml`
- Le fichier credentials existe : `ls ~/.cloudflared/`

### Le launcher ne reçoit pas les actualités

1. Testez l'API directement : `https://news.mondomaine.com/api/news`
2. Vérifiez que l'URL dans `api.js` est correcte
3. Regardez la console du launcher (F12)

---

## 🗑️ Nettoyage Automatique des Actualités

Le serveur inclut un système de **nettoyage automatique** des actualités :

- ✅ Les actualités de **plus d'1 mois** sont automatiquement supprimées
- ✅ Le nettoyage s'exécute **tous les jours** à 00h00
- ✅ Le nettoyage s'exécute aussi **au démarrage du serveur**
- ✅ Aucune action manuelle requise

**Logs du nettoyage** :
```bash
pm2 logs news-server | grep CLEANUP
# Affiche : [CLEANUP] X actualité(s) de plus d'1 mois supprimée(s)
```

**Désactiver le nettoyage automatique** (non recommandé) :
Si vous voulez désactiver cette fonctionnalité, commentez ces lignes dans `server.js` :
```javascript
// setInterval(cleanupOldNews, 24 * 60 * 60 * 1000)
// cleanupOldNews()
```

**Avantages** :
- 📉 Base de données reste légère
- 🚀 API plus rapide (moins de données à traiter)
- 💾 Économise l'espace disque
- 🧹 Pas de vieilles actualités obsolètes dans le launcher

---

## 🎯 Checklist finale

- [ ] Raspberry Pi OS installé et à jour
- [ ] Node.js installé (v20.x)
- [ ] Serveur déployé et dépendances installées
- [ ] Variables d'environnement configurées (.env)
- [ ] Interface React construite (npm run build)
- [ ] PM2 configuré pour démarrage auto
- [ ] Cloudflare Tunnel configuré et actif
- [ ] DNS pointé vers le tunnel
- [ ] Accès à l'interface admin OK
- [ ] Launcher configuré avec la bonne URL API
- [ ] Première actualité créée et visible dans le launcher

---

**🎉 Félicitations ! Votre serveur d'actualités est opérationnel ! 🎉**

Besoin d'aide ? Vérifiez les logs avec `pm2 logs news-server`.

**🗑️ Note** : Les actualités seront automatiquement supprimées après 1 mois.
