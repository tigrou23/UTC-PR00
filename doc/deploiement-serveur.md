# Déploiement de l'application 🌍

Lien vers le site web : [https://pr00.hugopereira.fr](https://pr00.hugopereira.fr).

___

*Le serveur est un VPS (Virtual Private Server) fourni par [Ionos](https://www.ionos.fr/).*

Toutes les manipulations ont été réalisées avec un utilisateur disposant des droits d'administration grâce au protocol SSH. Nous avons ouvert les ports 22 (SSH), 80 (HTTP) et 443 (HTTPS) pour permettre l'accès au serveur.

## Déploiement sur un serveur Debian

Pour déployer notre application sur un serveur Debian, nous pouvons suivre les étapes suivantes :

1. Mettre à jour le serveur Debian :

```bash
sudo apt update
sudo apt upgrade
```

2. Cloner le dépôt Git de l'application :

```bash
git clone https://github.com/tigrou23/UTC-PR00
```

3. Installer Apache2 :

```bash
sudo apt install apache2
```

4. Copier le contenu du dossier `UTC-PR00` dans le dossier `/var/www/html/UTC-PR00` :

```bash
sudo cp -r UTC-PR00/* /var/www/html/
```

5. Paramétrer Apache2 pour qu'il utilise le fichier `index.html` comme page d'accueil :

```bash
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/UTC-PR00.conf
```

```bash
sudo nano /etc/apache2/sites-available/UTC-PR00.conf
```

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/UTC-PR00

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

6. Activer le site Apache2 :

```bash
sudo a2ensite UTC-PR00
```

7. Redémarrer Apache2 pour appliquer les changements :

```bash
sudo systemctl restart apache2
```

8. Utiliser [Certbot](https://certbot.eff.org/) pour obtenir un certificat SSL gratuit :

```bash
sudo certbot --apache
```

9. Vérifier que l'application est accessible via HTTPS :

Accéder à [https://pr00.hugopereira.fr](https://pr00.hugopereira.fr) !