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
