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

# Journal de décisions — MIELAISSA.CA

## 2026-10-14 — Préserver la boutique existante

Situation : GitHub contenait un README minimal, tandis que mielaissa.ca disposait déjà d'un site WordPress/WooCommerce et de produits publics. Décision : créer une **extension additive**, sans réécrire le marchand, le panier, le thème, les comptes ni les prix.

## 2026-10-14 — Les vraies données restent dans WooCommerce

Le shortcode lit produits, catégories, tarifs et liens depuis WooCommerce à l'exécution. Les coupons ne sont présentés que si identifiables et compatibles avec les mécanismes annoncés. WooCommerce reste autorité pour eligibility, minimum de commande, limite par client, géographie et conversion de paiement.

## 2026-10-14 — Déploiement désactivé par défaut

Pas de SSH de production confirmé. Une archive CI est disponible pour installation contrôlée, mais le workflow distant est conditionnel à MIELAISSA_DEPLOY_ENABLED=true. Il ne touche pas aux autres dossiers WordPress.

## 2026-10-15 — Durcissement et reprise systématique

- Vérification coupons non publiés, expirés et dont la limite d'utilisation globale est atteinte.
- Affichage des produits réellement visibles et mention des produits épuisés.
- Tests PHP multi-version, JavaScript et ZIP.
- Workflow de publication attaché au HEAD de main ayant réussi CI ; conservation de l'ancien plugin en rollback et vérification checksum.
- Documentation AGENTS + cinq fichiers imposés afin de reprendre sans reproduire l'audit initial.

## 2026-10-15 — TAKATAK : pas de second registre de clients

L'écosystème GROUPE TAKATAK centralise les identités lorsque les intégrations sont approuvées. Aucun accès ou schéma tenant-scoped pour Miel Aissa n'est défini ici ; n'implémenter aucune synchronisation clients ni authentification spéculative. Définir le contrat avec permissions avant de coder l'intégration.

## Décisions encore ouvertes

Thème définitif, emplacement public des shortcodes, traduction complète de la boutique, normes de communication sur les promotions, hébergement réel, staging, sauvegarde, autorisation de mise en ligne, API TAKATAK et modalités de consentement.

## 2026-10-15 — Compatibilité des personnalisations existantes

Le site a historiquement utilisé [mielaissa_points], _miel_diamonds et /en-ca/games/ pour fidélité. Conserver ces contrats existants ; les fonctions de l'extension vitrine ont été préfixées de manière distinctive (mielaissa_storefront_*) pour éviter des collisions PHP. Aucun remplacement du système de fidélité n'est prévu.

## 2026-10-15 — Hébergement : pistes historiques, pas un chemin déduit

MochaHost/cPanel bolonca/s3650.can1.stableserver.net apparaissent dans l'historique de la boutique (octobre 2026). La racine WordPress, son emplacement actuel, les sauvegardes, les clés et l'autorisation de déploiement ne sont toujours pas confirmés : on ne déploie pas avec un chemin inventé.


## 2026-10-15 — Offres honnêtes et défaut de dépendance

Pour ne pas promettre une réduction générale, les textes de coupon précisent « commande admissible » et « première commande admissible » : WooCommerce reste décisionnaire des droits au paiement. Sans WooCommerce, le shortcode de catalogue affiche un message de panne, et la section offres n'affiche aucun code invérifiable. Les tests couvrent cet état.

## 2026-10-15 — Rollback après checksum

Si le transfert SSH provoque une différence SHA256, la version précédente de l'extension est réinstallée automatiquement si elle existe. Ce mécanisme ne remplace pas un backup intégral WordPress + SQL.


## 2026-10-15 — Sécuriser les chemins cPanel et l'identité du serveur

Les racines WordPress sous des dossiers de domaine peuvent contenir des points. On les autorise tout en interdisant la traversée des répertoires et on impose un préflight WP-CLI sur `home` pour éviter de publier par erreur chez un autre marchand du compte partagé.

## 2026-10-15 — Ne jamais assimiler santé HTTP à extension activée

Une vérification quotidienne GitHub Actions contrôle la disponibilité publique, mais ne remplace ni la preuve d'activation WordPress ni les tests du panier et des commandes.

## 2026-10-15 — Respecter la visibilité catalogue WooCommerce

`wc_get_products` est invoqué avec `visibility=catalog` avant `limit`, conformément aux paramètres pris en charge par WooCommerce. Le code continue de rejeter les produits qui ne sont pas visibles pour des raisons supplémentaires. La version de l'extension est portée à 0.2.3.


## 2026-10-15 — Résilience aux erreurs WooCommerce

Une erreur interne d'accès aux produits ne doit pas afficher de trace sensible ni tuer la page d'accueil : le shortcode renvoie une indisponibilité générique. Un coupon corrompu est ignoré sans empêcher l'affichage des autres offres. Les tests simulent ces exceptions.

## 2026-10-15 — Contrôler de nouveau la version juste avant SSH

Les vérifications du contexte GitHub workflow_run ne suffisent pas si un nouveau commit a été poussé pendant l'attente. Le script du workflow de déploiement interroge le HEAD distant main au moment de l'exécution et interrompt toute publication d'une version supplantée.


## 2026-10-16 — Contrôle exhaustif du ZIP au lieu d'une empreinte PHP isolée

Le déploiement considère tous les octets de l'extension (PHP, CSS, JS et autres fichiers futurs) dans un manifeste trié SHA256. Un fichier additionnel ou supprimé doit également modifier la preuve d'intégrité ; les copies suspectes sont rejetées avant la bascule. La vérification post-bascule conserve le retour arrière existant.

## 2026-10-16 — Résilience de la vitrine et disponibilité publique

Les erreurs de coupon et de produit sont isolées individuellement, sans jamais afficher de messages internes aux acheteurs. L'absence de cartes valides affiche un état vide plutôt qu'une grille blanche. La surveillance HTTP est indépendante de la version WordPress : son succès ne constitue ni une preuve de déploiement, ni un test de paiement.
