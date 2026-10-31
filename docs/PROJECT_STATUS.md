## 2026-10-30 23:58 — Codex — assistant OpenAI — Capture fidèle v2

AVANT : relu la directive de fidélité, vérifié l’état du dépôt et l’accès réseau ; source toujours non autorisée dans cet exécuteur. Note préalable GitHub PR #3 et NOTEPAD Drive.

PENDANT : étendu la récupération aux fichiers CSS du thème/page builder, imports CSS récursifs, polices, images responsive et lazy, scripts publics et médias statiques même origine. Octets originaux inchangés, SHA256 et redirections conservés. Aucun script exécuté ; aucune connexion, commande ou écriture WordPress. Les ressources tierces, manquantes, en erreur ou au-delà des limites rendent la capture incomplète. Queries de version uniquement sur assets publics ; pas de tokens privés conservés dans les rapports de dépendances manquantes.

APRÈS : 9 tests locaux réussis et typecheck réussi. Un vérificateur d’archives détecte altérations et chemins sortant de l’archive. Il ne valide jamais le clone visuel ni la reprise transactionnelle à partir d’une simple empreinte. CI de la révision publiée à vérifier dans la PR. Le build public du prototype rejeté reste bloqué. Aucun visuel inventé, aucune capture live prétendue, aucun déploiement.

Commandes à utiliser seulement depuis un accès réseau autorisé à mielaissa.ca :

```
npm run capture
npm run audit:reference -- /chemin/prive/vers/la/capture
```

Sorties : migration-private/TIMESTAMP/manifest.json, pages/ et assets/, gitignorés. Valeur `complete` = couverture des ressources statiques découvertes, pas preuve d’exhaustivité du site/SEO ni de fidélité fonctionnelle. L’audit garde `visualParityVerified:false` et `transactionalMigrationComplete:false`.

Limites restantes : styles Google Fonts/CDN ou widgets tiers à inventorier avec des accès dédiés, pages privées non parcourues, médias sans extension et URLs à paramètres non reconnus à examiner, captures bureau/mobile réelles et export Woo à récupérer. Ne pas envoyer les archives brutes contenant du HTML dans GitHub. La prochaine étape reste l’acquisition réelle des originaux puis leur conversion en composants Node fidèles au source.

---

## Directive propriétaire — copie fidèle du site existant — 2026-10-30 23:52

**Signé : Codex — assistant OpenAI.** Le propriétaire a rejeté la refonte ambre/crème et demande un clone fidèle de https://mielaissa.ca/ en Node.js. Ce correctif de périmètre prévaut sur les comptes rendus plus anciens ci-dessous.

- Garder le projet existant : marque/logo, disposition, menus, ordre des sections, textes, produits, parcours, pages et fonctions. Ne pas substituer une nouvelle direction artistique ou une nouvelle sélection de fonctions.
- Les améliorations d’images sont autorisées si elles préservent l’identité et les produits réels. Pas de faux emballage, de nouvelle marque ou d’illustrations remplaçant arbitrairement les photos.
- Le prototype éditorial actuel et ses captures sont **rejetés comme cible de migration**. Les CI vertes prouvent son fonctionnement technique, pas la ressemblance ni l’acceptation. Ne pas le publier comme clone terminé.
- Les anomalies du site source (contenu ALKA-O, doublons, redirections) doivent être relevées, sans réécriture/suppression autonome. Toute correction fonctionnelle ou de contenu doit rester distincte de la conversion fidèle.
- Première dépendance : récupérer le HTML rendu, les CSS du thème/page builder, polices et médias originaux, plus des captures source bureau/mobile. Sans ces éléments, ne pas inventer les styles manquants ni prétendre une copie visuelle exacte.
- Accès revérifiés : réseau de l’exécuteur restreint sans mielaissa.ca ; outil navigateur associé non exposé, connexion Opera antérieure en demande de reconnexion ; recherche Drive par noms MIELAISSA/Miel Aissa ne trouve pas de sauvegarde du thème. Les exports commerciaux restent aussi à obtenir.
- Prochaine action : acquérir les fichiers/captures par un accès autorisé, remplacer le prototype par les composants reproduisant le source, puis comparer chaque page et parcours aux références. Autorisation déjà donnée, aucune nouvelle refonte proposée.

---

# Migration Node.js — priorité actuelle (2026-10-30)

**Codex — assistant OpenAI.** Le propriétaire a explicitement demandé le remplacement de WordPress par une solution Node.js dans ce dépôt. Les notes anciennes ci-dessous décrivent le périmètre historique du plugin, désormais dépassé pour le développement. Elles restent utiles pour préserver la boutique et le retour arrière.

Voir **docs/NODE_MIGRATION.md** pour l'inventaire réel, les sources lues, le code livré, les accès manquants et l'ordre de bascule. Branche : `feat/node-storefront-20261030`. Application Node développée, publication de production **non effectuée**. Données transactionnelles toujours dans WordPress. Nouvelle identité TAKATAK non provisionnée, paiement fermé (503), photos/logo originaux à récupérer. Le plugin existant n'est pas la cible de publication Node.

## Preuve GitHub et remise — 2026-10-30 — Codex — assistant OpenAI

PR #3 : https://github.com/takatakca/MIELAISSA.CA/pull/3 (draft, non mergée). Révision fonctionnelle e4a1dc4ae634180410ba37c54782c4b54fb70cbf : CI Node 41049533489 **success**, CI historique multi-PHP 41049533336 **success**. Tests navigateur compilé 3/3, tests de capture/import 3/3 ; build et typecheck réussis. Langue HTML vérifiée côté serveur FR/EN. Les captures, le code source ZIP et le guide ont été déposés dans le Drive privé MAIN → Miel Aissa → 6. Site web, hébergement et serveur ; parents et partage privé relus. NOTEPAD, journal quotidien et addendum Opérations signés. La présente mise à jour est documentaire ; relire la CI du HEAD suivant pour son statut exact.

Aucun déploiement, aucune suppression WordPress. BLOC-MIEL-MIGRATION : originaux et export Woo complet, sauvegarde restaurable/cible Node, réconciliation transactionnelle et scope MIELAISSA dédié dans TAKATAK-V1. Prochaine action : obtenir ces sources privées via les connecteurs/identités autorisés, compléter capture/reprise sans refaire la vitrine, vérifier le staging transactionnel, puis basculer avec rollback. Autorisation propriétaire de développer et migrer déjà donnée ; pas besoin de la redemander.

---

# État du projet — MIELAISSA.CA

Mise à jour : 15 octobre 2026. Dépôt : takatakca/MIELAISSA.CA ; branche main.

## Périmètre réel

Cette base GitHub n'est pas l'installation complète de WordPress. Elle contient une **extension complémentaire** pour la boutique WooCommerce existante, sans accès aux commandes, aux comptes clients ni aux données personnelles.

## Réalisé dans GitHub

- Shortcodes [mielaissa_storefront] (vitrine catalogue dynamique FR/EN) et [mielaissa_offers] (coupons réellement configurés dans WooCommerce).
- Catalogue, prix, catégories, photos et URLs récupérés dans WooCommerce, sans import de produits fictifs.
- Rejet des coupons inexistants, non publiés, expirés, au type inattendu ou ayant atteint leur limite d'utilisation globale. L'éligibilité au panier et le premier achat sont contrôlés par WooCommerce pendant le paiement.
- Produits filtrés par visibilité, étiquette multilingue en rupture de stock, CSS responsive et JS de copie du code.
- CI pour plusieurs versions de PHP, validation JS, archive ZIP d'extension.
- Workflow déploiement SSH opt-in, limité au plugin, révision exacte validée, bascule avec sauvegarde précédente et contrôle SHA256.
- Relève et exploitation documentées.

## Ce qui n'est PAS vérifié ou terminé

- L'environnement d'hébergement réel (racine WordPress, version PHP, plugins actifs, DNS, sauvegardes, droits SSH).
- Installation et activation effective de la nouvelle extension sur un WordPress de test puis en production.
- Tests de bout en bout du thème en place, variantes, stock, coupons, panier, paiements et commandes.
- Vérification visuelle du rendu dans la boutique réelle.
- Configuration des variables et secrets GitHub MIELAISSA_* : aucune valeur ne figure dans le dépôt.
- Autorisation d'utiliser une version de page publique avec les shortcodes.
- Intégration TAKATAK : non implémentée faute de contrat d'API et d'accès confirmés. Ne pas créer de deuxième système d'identité.
- Déploiement effectif : **non confirmé** ; les précédentes exécutions de publication avaient été ignorées.

## État de publication

Code sur GitHub : oui. CI : consulter les runs de la dernière révision, ne pas extrapoler les runs anciens. Artefact ZIP : généré quand le job package réussit. Production : en attente de preuve de déploiement WordPress et de tests réels. Ticket canonique : issue #1.

Voir TASK_QUEUE.md et AGENT_HANDOFF.md.

## Informations d'hébergement historiques à revalider

Une correspondance d'hébergement antérieure (début octobre 2026) associe mielaissa.ca à MochaHost, compte cPanel bolonca et serveur s3650.can1.stableserver.net, après une migration vers Reseller 15. Ce sont des **pistes de localisation**, pas une preuve que le site est encore sur cette installation ni une racine WordPress connue. Aucun chemin public_html ni accès SSH pour Miel Aissa n'est déduit de ces informations.

Des fonctions de fidélité WordPress ont déjà été utilisées sur la boutique : [mielaissa_points], champ utilisateur _miel_diamonds et route /en-ca/games/. L'extension actuelle n'enregistre ni ne modifie ces éléments. Vérifier leur coexistence durant les tests de non-régression.

Un contrôle intégré en lecture seule est disponible à scripts/wordpress-smoke.php pour WordPress/WooCommerce via WP-CLI. Aucun accès live confirmé pour l'exécuter actuellement.


## Durcissement complémentaire (15 octobre 2026)

- Plugin version 0.2.2 : textes des offres explicites sur les commandes admissibles et la première commande.
- Fonctions internes préfixées mielaissa_storefront_* pour éviter les collisions avec les personnalisations fidélité historiques.
- Tests du fonctionnement sans WooCommerce (état dégradé sûr), du stock et de coupons épuisés/invalides.
- Workflow de publication : vérification de port SSH, bascule réversible, restauration du dossier précédent en cas de différence SHA256.
- Contrôle d'intégration sans écriture : scripts/wordpress-smoke.php (non exécuté sur l'hébergement réel).


## Résultat CI récent

- Run 38777390418 pour 603a7a6027d6548863cd92a8179f7f54bf96f209 : succès (PHP 7.4, 8.2, 8.3, JavaScript, archive).
- Correction de l'environnement simulé des tests sans WooCommerce, à ne pas confondre avec un problème connu dans le vrai WordPress.
- Fichier .gitignore ajouté pour empêcher l'ajout accidentel de sauvegardes WordPress, exports de données, secrets et archives.
- Dernière CI requise pour le nouveau HEAD doit être consultée avant toute éventuelle publication.


## Session complémentaire — code sur main v0.2.3

- 4cbabffe : contrôles des chemins de déploiement acceptant les points des domaines cPanel sans accepter ../, préflight WP-CLI contre le mauvais site, workflow déclenché uniquement depuis push CI main du même dépôt.
- 831bfbf5 : contrôle quotidien de santé de la page publique, strictement séparé du statut du plugin ; bash -n des scripts, GitHub schedule et déclenchement manuel possible.
- be6e596b : requête catalogue officielle `wc_get_products( visibility = catalog )` avant la limite ; évite une liste vide parce que les dernières fiches sont masquées.
- CI complète vérifiée : 38790908812, 38791128612 et 38791232939, conclusions success.
- Toujours pas d'activation WordPress en production ni d'accès SSH vérifié.


## Résilience WooCommerce et révision principale (15 octobre 2026)

- Plugin 0.2.4, commit 33c29d4 : exceptions du chargement des produits interceptées, réponse publique de repli sans détails internes ; coupons individuellement invalides n'empêchent plus d'afficher les autres promotions valides.
- Tests de régression associés ; run CI GitHub 38791678148 réussi.
- f1473607 : contrôle `git ls-remote origin refs/heads/main` immédiatement avant publication ; refuse de déployer une révision validée mais déjà remplacée par un nouveau main.
- Le statut de production reste non déployé/non vérifié : seuls les fichiers GitHub et pipelines ont été modifiés.


## Reprise du 16 octobre 2026 — version 0.2.7

- Code publié sur GitHub : corrections `570afec6`, `049450db`, `2cfef81a`, `c5aac93e`, `8b8b2cff`.
- Plugin plus résilient aux exceptions WooCommerce (recherche/statut de coupon, visibilité produit, construction des fiches). Les cartes invalides sont filtrées avant affichage et l'état vide reste lisible.
- Transmission WordPress : manifeste SHA256 complet PHP/CSS/JS et fichiers additionnels, vérifié AVANT l'échange de dossiers et APRÈS. Simulation de fichiers modifiés/supprimés en CI.
- Disponibilité publique : workflow GitHub Actions sur push et quotidien. Exécutions 38848751393, 38848854010 et 38848959851 réussies. Cette surveillance n'est PAS une preuve d'installation de l'extension.
- CI green vérifiées : 38848544219, 38848652264, 38848854034. Le statut de 38848959841 doit être vérifié après cette rédaction.
- **Production WordPress inchangée/non vérifiée** : déploiement SSH skipped, staging et credentials non confirmés. Ticket bloquant #1 toujours ouvert.
