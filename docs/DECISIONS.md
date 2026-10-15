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
