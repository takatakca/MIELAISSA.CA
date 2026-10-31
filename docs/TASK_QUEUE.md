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

# File de travail exécutable — MIELAISSA.CA

Ordre de priorité. Les items marqués en attente ne peuvent pas être considérés comme terminés sans preuve.

## P0 — Publication de la version réellement fonctionnelle

- [x] Reprendre le code existant et inventorier les workflows GitHub.
- [x] Corriger le filtrage des produits invisibles et les coupons épuisés.
- [x] Ajouter un indicateur d'indisponibilité produit et ses tests.
- [x] Protéger la publication par le résultat CI, SHA de main et rollback de plugin.
- [x] Ajouter AGENTS.md et les cinq fichiers de relève/exploitation.
- [ ] Confirmer accès WordPress, thème, WooCommerce, version PHP, environnement staging, sauvegarde et chemin exact du site auprès d'un accès autorisé.
- [ ] Installer le ZIP sur staging, activer et tester [mielaissa_storefront] et [mielaissa_offers].
- [ ] Vérifier simple/variable, pagination catalogue si nécessaire, rupture de stock, promotions, responsive FR/EN, navigation clavier et compatibilité thème.
- [ ] Vérifier commandes test/cart/paiement avec les méthodes réellement configurées, sans prélever de paiement réel.
- [ ] Vérifier restauration site et base, droits d'écriture limités, empreinte de clé SSH et variables GitHub Actions.
- [ ] Activer la publication uniquement après ces garanties et vérifier SHA distant, plugin activé, page intégrée et expérience client finale.
- [ ] Documenter lien de version publiée, preuve de déploiement, résultats tests et rollback.

## P1 — Fonctionnalités additionnelles à cadrer avec le marchand

- [ ] Confirmer l'identité visuelle officielle, médias licenciés, contenu et coordonnées.
- [ ] Définir la place des promotions et les mentions légales précises selon les règles de coupons du marchand.
- [ ] Évaluer le SEO technique, la vitesse, la conformité accessibilité WCAG, langues officielles et pages essentielles du site réel.
- [ ] Documenter si une intégration TAKATAK est nécessaire ; spécifier permissions tenant-scoped et consentement avant code.

## Procédure de reprise

Lire AGENTS.md, docs/AGENT_HANDOFF.md, puis chercher le **premier item faisable**, sans tenter d'inventer des accès. Pour les items bloqués, consigner le blocage et poursuivre les tâches de code indépendantes.

## Vérifications de non-régression déjà identifiées

- [ ] Confirmer que les programmes fidélité déjà présents restent intacts : [mielaissa_points], _miel_diamonds et /en-ca/games/ ; ne jamais créer ou copier des données clients pour ces vérifications.
- [ ] Investiguer, uniquement avec accès autorisé, les personnalisations historiques d'autres marques potentiellement présentes dans les pages Miel Aissa avant de toucher au contenu.
- [ ] Exécuter sur staging le contrôle intégré : wp --path=CHEMIN_WORDPRESS eval-file CHEMIN_REPO/scripts/wordpress-smoke.php ; consigner la sortie sans informations personnelles.


## Travaux de durcissement ajoutés et livrés

- [x] Préfixer les fonctions PHP pour limiter les risques de collision avec les personnalisations WordPress déjà présentes.
- [x] Tester l'affichage prudent quand WooCommerce est désactivé.
- [x] Vérifier l'état d'épuisement des coupons et leurs textes d'éligibilité FR/EN.
- [x] Protéger le transfert SSH par comparaison SHA256 avec rollback du plugin précédent lors d'une discordance.
- [x] Ajouter un test WordPress/WooCommerce réel, en lecture seule, exécutable avec WP-CLI après accès.


## Dernières tâches de code terminées

- [x] Identifier et corriger la défaillance CI introduite dans les stubs WordPress du test sans WooCommerce.
- [x] Valider le test sur PHP 7.4, 8.2, 8.3 et obtenir l'archive ZIP installable.
- [x] Ajouter .gitignore pour secrets WordPress et exports de données.


## Durcissement réalisé — session supplémentaire du 15 octobre 2026

- [x] Accepter les chemins de domaine de type `mielaissa.ca` en refusant les traversées de chemins.
- [x] Limiter le workflow privilégié au push main CI authentique du dépôt.
- [x] Vérifier le vrai nom de domaine WordPress par WP-CLI avant chaque transfert.
- [x] Ajouter contrôles de syntaxe shell et tests de validation de cible.
- [x] Ajouter surveillance GitHub Actions quotidienne de la disponibilité publique.
- [x] Corriger la requête catalogue pour filtrer la visibilité WooCommerce avant d'appliquer la limite.
- [x] Confirmer la CI de code et ses archives ZIP sur 4cbabffe, 831bfbf5, be6e596b.
- [ ] Vérifier la première exécution planifiée du workflow public-health et corriger une éventuelle anomalie.
- [ ] Toujours bloqué : confirmer WP_ROOT réel, l'accès, les sauvegardes et staging avant l'installation.


## Suite de durcissement exécutée

- [x] Attraper les erreurs WooCommerce de produits sans rendre publiques les erreurs internes.
- [x] Ignorer individuellement les coupons qui déclenchent une exception, sans retirer les autres coupons valides.
- [x] Ajouter tests d'erreur de requête et coupon et valider la CI 38791678148.
- [x] Revalider HEAD distant main juste avant publication pour refuser les anciennes révisions en attente.
- [ ] Vérifier la CI du dernier commit documentaire, puis reprendre la première tâche P0 requérant l'accès réel au site.


## Tâches réalisées lors de la reprise du 16 octobre 2026

- [x] Vérifier que la dernière CI du HEAD précédent est verte et confirmer que le déploiement distant est ignoré.
- [x] Éviter les exceptions non interceptées dans la recherche / statut des coupons et dans le getter de visibilité produit ; tests de régression.
- [x] Vérifier SHA256 de **tous** les fichiers d'extension après staging et après installation (et non uniquement le PHP principal).
- [x] Tester un transfert identique, un JS modifié et un fichier CSS manquant sans accès serveur.
- [x] Déclencher immédiatement le contrôle de santé du site public à chaque push main, tout en conservant le programme quotidien.
- [x] Vérifier l'exécution publique initiale 38848751393 (success) et deux autres contrôles sur push.
- [x] Ne pas laisser de grille vide si les objets WooCommerce individuels sont invalides ; affichage d'état vide explicite.
- [ ] **Blocage P0 réel :** confirmer et tester staging WordPress, backup restaurable, WP_ROOT, accès admin/SSH, puis déployer et vérifier la version activée.
