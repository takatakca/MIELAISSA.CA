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
