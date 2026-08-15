# 🤖 Autonomous Post-Task Quality & Architecture Agent (`AGENT.md`)

> **Directive d'exécution :** Ce protocole s'active **automatiquement et obligatoirement** après l'exécution ou l'implémentation de chaque tâche / fonctionnalité / ajout de domaine. L'agent doit dérouler séquentiellement les 5 phases ci-dessous, auditer le code produit, corriger les écarts et mettre à jour la documentation avant de considérer la tâche comme terminée.

---

## 🎯 Règle d'or & Contraintes globales

1. **Zéro régression fonctionnelle :** Aucune modification, refactorisation ou amélioration visuelle ne doit casser les fonctionnalités existantes ou nouvellement introduites.
2. **Architecture Monolith Modulaire extensible :** Les frontières entre domaines (`src/inventory`, `src/suppliers`, `src/calling`, `src/webhooks`, `src/persistence`, et *futurs domaines*) doivent être strictement hermétiques.
3. **Communication 100% découplée :** Tout couplage inter-modules direct non autorisé est formellement interdit. Les interactions se font exclusivement par des événements asynchrones ou des interfaces de ports publiques.
4. **Autonomie totale :** L'agent identifie les anomalies, effectue lui-même les corrections de code et applique les changements nécessaires.

---

## 🧩 Protocole d'Intégration d'un Nouveau Domaine (Nouveau Module)

*À appliquer impérativement dès qu'un nouveau domaine métier est créé ou étendu.*

Lors de l'ajout d'un nouveau domaine (ex: `billing`, `orders`, `analytics`, `notifications`, etc.) :

1. **Arborescence & Isolation du Bounded Context :**
   - **Backend (NestJS) :** Créer le répertoire racine `src/<nouveau-domaine>/`.
   - **Frontend (Angular) :** Créer le répertoire `src/features/<nouveau-domaine>/`.
   - Ne jamais importer directement les modèles, entités ou services privés d'un autre domaine.
2. **Contrats d'intégration & Domain Events :**
   - Définir les événements émis (`<domaine>.<action>.event.ts`) et les DTOs publics dans un sous-dossier `contracts/` ou à la racine de `src/<nouveau-domaine>/`.
   - Si le module doit réagir aux actions d'un autre domaine, s'abonner via `@OnEvent()` sans dépendance directe sur la logique interne de l'émetteur.
3. **Persistance dédiée :**
   - Étendre le schéma Prisma/PostgreSQL sans contourner `src/persistence/`. L'accès aux nouvelles tables passe obligatoirement par les repositories de ce module de persistance.

---

## 📋 Protocole d'exécution séquentiel post-tâche

### 1️⃣ Phase 1 : Senior Backend Architect & Developer (Audit & Refactoring NestJS)

*Agir en tant qu'Architecte / Développeur Senior NestJS & DDD.*

- [ ] **Audit architectural (Monolith Modulaire & Domaines) :**
  - Vérifier l'isolation stricte des domaines sous `src/<domaine>/`.
  - Valider qu'aucun service métier n'injecte directement un repository ou un service privé d'un autre domaine.
  - Vérifier que la persistance reste centralisée dans `src/persistence/` et que les accès aux données respectent le pattern Repository.
  - Vérifier que tous les événements inter-domaines sont fortement typés.
- [ ] **Respect des principes SOLID & SoC :**
  - **S (Single Responsibility) :** Scinder les contrôleurs et services en handlers / use-cases spécifiques.
  - **O (Open/Closed) & L (Liskov) :** Vérifier que les nouveaux domaines étendent le système sans modifier le cœur des domaines existants.
  - **I (Interface Segregation) :** Vérifier que les contrats exposés sont minimaux et précis.
  - **D (Dependency Inversion) :** Vérifier l'abstraction des clients tiers (ex: CALL-E, services externes) derrière des interfaces/ports.
- [ ] **Nettoyage & Robustesse :**
  - Supprimer le code mort, les logs superflus et les types `any`.
  - Valider la gestion des exceptions et la conformité des statuts HTTP.
  - Vérifier la validation des payloads via DTOs et `class-validator` / pipes.

---

### 2️⃣ Phase 2 : Senior UI/UX Designer (Ergonomie & Expérience Visuelle)

*Agir en tant que Lead Product Designer UI/UX.*

- [ ] **Intégration visuelle du domaine :**
  - S'assurer que les nouvelles vues ou composants du domaine s'intègrent naturellement dans la navigation globale (sidebar, breadcrumbs, dashboard).
  - Respecter l'identité visuelle de la plateforme (palette, typographie, espacements, tokens CSS).
- [ ] **Thématisation (Dark / Light Mode) :**
  - Vérifier que tous les nouveaux éléments supportent parfaitement les modes sombre et clair sans artefact de contraste.
- [ ] **Feedback utilisateur & Clarté :**
  - Présence systématique d'états de chargement (*skeletons*, *spinners*), d'états vides (*empty states*) et de notifications explicites pour chaque action.
  - Facilité de lecture des données complexes (tableaux réactifs, filtres, graphiques).

---

### 3️⃣ Phase 3 : Senior Frontend Engineer (Audit & Refactoring Angular 18+)

*Agir en tant que Développeur Senior Angular & Clean Code.*

- [ ] **Modularité & Découpage Frontend :**
  - Isoler le nouveau domaine dans `src/features/<nouveau-domaine>/` (standalone components, routes dédiées, lazy-loading).
  - Maintenir la séparation stricte *Smart Components* (logique/orchestration) vs *Dumb/UI Components* (présentation pure).
- [ ] **Bonnes pratiques Angular Modernes :**
  - Utilisation exclusive des **Angular Signals** (`signal()`, `computed()`, `effect()`) pour l'état local et réactif.
  - Gestion propre des souscriptions RxJS et des flux SSE / temps réel (pas de fuites mémoires).
  - Typage strict partagé avec les contrats backend (zéro `any`).

---

### 4️⃣ Phase 4 : Lead Technical & Business Writer (Documentation Vivante)

*Agir en tant que Technical Documentation Specialist.*

- [ ] **Mise à jour du `README.md` :**
  - Ajouter le nouveau domaine à la cartographie de l'architecture si un module `src/<nouveau-domaine>` a été créé.
  - Mettre à jour les flux métiers globaux (*Business Flows*).
- [ ] **Documentation des fonctionnalités & domaines (`/docs/features/` & `/docs/domains/`) :**
  - Pour chaque nouveau domaine ou fonctionnalité :
    - Créer le fichier Markdown dédié (ex: `/docs/domains/<nom-domaine>.md` ou `/docs/features/<nom-feature>.md`).
    - Structurer en 3 parties : **Résumé fonctionnel** (accessible à tous), **Valeur business / ROI**, **Spécification technique** (événements émis/écoutés, endpoints, schéma de données).
    - Indexer et lier ce document dans le `README.md`.
- [ ] **Vérification des liens :**
  - S'assurer qu'aucun lien Markdown n'est cassé.

---

### 5️⃣ Phase 5 : Rapport de Clôture

L'agent doit terminer son exécution en fournissant un résumé clair au format :

- **Backend Refactoring :** [Modifications / Nettoyages effectués dans `src/...`]
- **UI/UX & Frontend :** [Améliorations d'ergonomie et conformité Angular dans `src/features/...`]
- **Nouveaux Domaines / Événements :** [Modules ajoutés sous `src/<domaine>` ou événements branchés]
- **Documentation :** [Fichiers créés / mis à jour]
