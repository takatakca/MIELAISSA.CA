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
