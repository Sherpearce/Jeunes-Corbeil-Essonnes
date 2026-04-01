# Portail Jeunesse – Corbeil-Essonnes

Site web de la **Direction de la Jeunesse de Corbeil-Essonnes**.

## Fonctionnalités

| Page | Description |
|---|---|
| **Accueil** | Quatre boutons d'accès aux services |
| **Simuler mes droits** | Questionnaire interactif pour estimer les dispositifs auxquels l'utilisateur est éligible |
| **Faire une demande** | Formulaires de demande pour chacun des 4 dispositifs (Projet Jeune, Projet Jeune Sport, Pied à l'Étrier, Projets Jeunes Solidarité) |
| **Suivre ma demande** | Recherche du statut d'un dossier par numéro (format CE-AAAA-XXXX) |
| **Contacter** | Formulaire de contact (Nom, Mail, Téléphone, Objet, Message) |

## Démarrage rapide (en local)

Ce site est une application web statique (HTML / CSS / JavaScript pur). **Aucun serveur, aucune dépendance, aucune installation** n'est requise.

### Option 1 – Ouvrir directement dans le navigateur

Double-cliquez sur le fichier `index.html` ou faites glisser-déposez-le dans votre navigateur.

### Option 2 – Serveur local (recommandé pour éviter les restrictions CORS)

**Avec Python 3 :**

```bash
python3 -m http.server 8080
```

Puis ouvrez [http://localhost:8080](http://localhost:8080).

**Avec Node.js (npx) :**

```bash
npx serve .
```

**Avec VS Code :** Installez l'extension *Live Server*, clic-droit sur `index.html` → *Open with Live Server*.

## Structure du projet

```
.
├── index.html          # Page principale (SPA)
├── css/
│   └── style.css       # Styles
├── js/
│   └── app.js          # Logique de navigation, formulaires et simulation
└── assets/
    └── logo-corbeil.svg  # Logo stylisé de la ville de Corbeil-Essonnes
```

## Remarques

- Les formulaires affichent une confirmation visuelle mais **n'envoient pas de données** (pas de backend). Pour une mise en production, il faudra connecter les formulaires à un service d'envoi d'e-mails ou une API.
- Les numéros de dossier de démonstration pour la page *Suivre ma demande* : `CE-2024-0001`, `CE-2024-0012`, `CE-2024-0034`, `CE-2024-0056`, `CE-2024-0099`.
- Pour remplacer le logo, déposez le fichier officiel dans `assets/logo-corbeil.svg` (ou `.png`) et mettez à jour le chemin dans `index.html`.
