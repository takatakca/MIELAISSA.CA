## Relève courante — 2026-11-07 11:00 UTC — Codex — ChatGPT Work

- Reprise exclusive et séquentielle depuis main `b122567cdaa8eeeac75caf679462c19d25c582ba` : PR #2 historique puis branche complète PR #5 `c910f8d80468a1622cd52051374bba0de33500b1` (incluant les deux commits Apache/diagnostic absents du snapshot PR). Les anciennes notes ci-dessous sont conservées comme historique.
- Source préparée : notice optionnelle PHP 1.0.1 limitée à GET/HEAD de l'accueil canonique sans query ; POST/actions panier/AJAX, pagination, administration, preview et feed traversent WordPress. HEAD sans corps. Snippet Apache limité GET/HEAD et query vide. Aucun changement au HTML statique ni au plugin WooCommerce existant.
- Validation : test comportemental de 21 requêtes PHP isolées ajouté au contrôle existant ; matrice GitHub PHP 7.4/8.2/8.3, JavaScript et ZIP attendue avant fusion. PHP absent de cet exécuteur local : aucun succès PHP local inventé. Résultats et SHA final seront consignés dans le reçu de PR et le journal Drive sans boucle de commits documentaires.
- Production observée AVANT intervention : `https://mielaissa.ca/` et `https://www.mielaissa.ca/`, HTTP 200, 2565 octets, SHA256 `0537fb3877623e231686385c46cb2278602636f055f4353ab116664cbb769844`, exactement le HTML `deploy/legacy-notice/index.html`. La notice était déjà en ligne ; cette session ne l'a pas déployée. CTA transfert observé sur le formulaire public TAKATAK, sans soumission ni preuve de réception d'un lead.
- Aucun accès WordPress/cPanel/SSH, WP_ROOT, staging ou backup restaurable actuellement vérifié pour cette cible. Aucune application Coolify associée trouvée sur les deux contrôleurs consultés. DNS observé `209.42.24.127`. Ne pas traiter cette page statique comme preuve de santé MySQL, commandes, plugin activé ou checkout. Aucun déploiement WordPress/MU-plugin/Apache, aucune activation de flag, aucun changement DNS/mail/données/identité effectué.
- PR #3 reste draft : prototype Node rejeté, fidélité et migration commerciale non acceptées (#4). L'autorisation de poursuivre existe ; les originaux, l'accès à l'installation et les validations techniques manquent. Préserver source, fidélité `[mielaissa_points]`, `_miel_diamonds` et `/en-ca/games/`. Aucun remplacement visuel inventé.
- Prochaine action : vérifier CI candidate, fusionner la source examinée, vérifier main CI et health public, puis reçu signé. Reprendre #1/#4 uniquement avec preuve des dépendances techniques ; ne pas déclarer la migration ou les paiements terminés.

Signature : Codex — ChatGPT Work.

---

# État du projet — MIELAISSA.CA

> **2026-11-05 status:** Optional TAKATAK transfer notice code is prepared for Miel Aissa, disabled by default. The live WooCommerce shop has NOT been changed. Manual MU-plugin deployment, staging, owner approval and verified TAKATAK transfer lead intake remain necessary. Details: [TAKATAK_LEGACY_NOTICE.md](TAKATAK_LEGACY_NOTICE.md).

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
