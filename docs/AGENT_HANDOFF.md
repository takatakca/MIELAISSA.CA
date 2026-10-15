# Relève obligatoire — MIELAISSA.CA

**Date de session :** 15 octobre 2026.
**Dépôt :** takatakca/MIELAISSA.CA.
**Branche de publication :** main.
**État GitHub lu au départ :** ac9431257927712507b7a8bb9a637f4da632d7dc.
**Dernière révision de code connue avant cette relève :** 055be0dbca7ea7c7af6d25c6a631082c5f8e9d9b. Après le commit de documentation, la référence canonique est le **HEAD distant de main**, à relire (le SHA de cette page ne peut pas anticiper son propre commit).

## Dernière tâche terminée

- Version plugin 0.2.0 : produit visible uniquement, étiquette de stock, coupons non publiés/expirés/épuisés ignorés.
- Tests supplémentaires et protection du déploiement.
- CI étendue à PHP 7.4/8.2/8.3 et node --check ; package ZIP avec vérification unzip.
- Constitution de la documentation AGENTS, PROJECT_STATUS, TASK_QUEUE, AGENT_HANDOFF, DEPLOYMENT, DECISIONS.

## Tâche en cours

Validation des nouveaux workflows GitHub Actions sur le dernier main. La tâche suivante dépend ensuite de l'accès réel au WordPress de Miel Aissa, absent du dépôt.

## Fichiers modifiés pendant la session

- wordpress/wp-content/plugins/mielaissa-storefront/mielaissa-storefront.php
- wordpress/wp-content/plugins/mielaissa-storefront/assets/storefront.css
- tests/smoke.php
- .github/workflows/ci.yml
- .github/workflows/deploy.yml
- AGENTS.md
- docs/PROJECT_STATUS.md, TASK_QUEUE.md, AGENT_HANDOFF.md, DEPLOYMENT.md, DECISIONS.md
- README.md (s'il est modifié dans la même série de commits)

## Vérifications et preuves

- Session précédente : CI réussite pour ac943125 ; déploiement SSH ignoré.
- Cette session : inspecté tree GitHub, code PHP/JS, les derniers runs, PR (aucune) et issue #1 (ouverte), site public existant.
- Relire les **derniers** résultats CI sur GitHub après chaque commit ; un état “queued” ne vaut pas réussite.
- Commandes exécutées par GitHub CI : bash scripts/check.sh ; node --check ; zip / unzip -t lorsque les jobs passent.
- Les smoke tests utilisent des objets simulés WordPress/WooCommerce ; ils ne prouvent pas l'intégration réelle.

## Erreurs / risques / blocages

- Le dépôt ne contient pas la racine WordPress réelle, des identifiants, une sauvegarde, les variables/secrets SSH ou la preuve d'activation du plugin.
- Les commandes de paiement et données clients ne doivent jamais être utilisées comme terrain de test sauvage.
- WordPress PHP et WooCommerce de production non inventoriés.
- Le déploiement est volontairement **désactivé tant que MIELAISSA_DEPLOY_ENABLED n'est pas true** ; ne pas déclarer publication réussie.
- Le nouveau workflow doit être surveillé après publication des fichiers ; corriger toute erreur CI avant une activation.

## Accès nécessaires (ne pas stocker de secrets ici)

- Autorisation et accès lecture admin WordPress / état WooCommerce pour préflight et staging.
- Cible SSH dédiée (host, port, utilisateur, WP_ROOT), host key validée, autorisation d'installation de la clé de déploiement.
- Accès aux sauvegardes/restauration et confirmation de la page qui doit recevoir les shortcodes.

## Prochaine action exacte

1. Ouvrir GitHub main HEAD et les workflows CI/deploy de ce SHA ; corriger immédiatement les erreurs.
2. Si CI est verte, consulter issue #1 et retrouver les paramètres d'hébergement dans une source autorisée.
3. Préparer staging + sauvegarde WordPress ; tester réellement WooCommerce, ensuite seulement activer MIELAISSA_DEPLOY_ENABLED et vérifier le résultat live.
4. Réécrire ce fichier avec les vrais résultats et le SHA de la dernière révision en cours à chaque nouvelle session.
