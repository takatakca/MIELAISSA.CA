# Déploiement vérifiable — extension Miel Aissa

## 1. Ce dépôt n'est PAS une sauvegarde complète du site

Il contient seulement wordpress/wp-content/plugins/mielaissa-storefront.
L'installation WordPress/WooCommerce de production est distincte et n'est pas accessible depuis ce code. Ne jamais rsync la racine du dépôt sur public_html, modifier le DNS ou supprimer le thème actif.

## 2. Préflight avant première activation

1. Identifier le site réel, version PHP, WordPress, WooCommerce, thème, autres plugins, stockage et racine WP_ROOT.
2. Vérifier l'autorisation d'administrer ce site, conserver un backup fichiers + base de données **restaurable** et un plan de retour arrière.
3. Installer la dernière archive ZIP du job package vert de GitHub CI sur une copie de test WordPress/WooCommerce.
4. Dans une page de prévisualisation seulement, ajouter [mielaissa_storefront lang="fr" limit="8"] et éventuellement [mielaissa_offers].
5. Contrôler responsive FR/EN, variantes, stock, produits masqués, codes selon les vraies restrictions du panier, panier, checkout, clavier et thème.
6. Confirmer avec le marchand les contacts, textes et promotions.

## 3. Paramètres GitHub Actions

Repository > Settings > Secrets and variables > Actions > Variables :
- MIELAISSA_DEPLOY_ENABLED : laisser vide/false jusqu'à approbation du préflight, puis true.
- MIELAISSA_SSH_HOST : hôte approuvé, pas une supposition.
- MIELAISSA_SSH_PORT : port numérique (p. ex. 22 si réellement vérifié).
- MIELAISSA_SSH_USER : utilisateur SSH limité.
- MIELAISSA_WP_ROOT : chemin absolu WordPress, par exemple /home/USER/public_html seulement si confirmé.

Repository > Settings > Secrets and variables > Actions > Secrets :
- MIELAISSA_SSH_PRIVATE_KEY : clé privée dédiée au déploiement, avec contrepartie publique installée sur le compte cible.
- MIELAISSA_SSH_KNOWN_HOSTS : empreinte SSH vérifiée auprès de l'hébergeur hors du canal attaquable ; ne pas désactiver StrictHostKeyChecking.

## 4. Pipeline réel

1. Chaque push main lance Miel Aissa CI : PHP 7.4, 8.2, 8.3, smoke tests, syntaxe JS et production ZIP.
2. En cas de succès, un workflow_run peut démarrer Deploy Miel Aissa plugin seulement si la variable d'activation vaut true ET que le SHA est encore le HEAD de main.
3. Le pipeline checkout exactement ce SHA, revalide le source et déploie dans un dossier temporaire sous wp-content/plugins/.
4. L'ancien plugin est conservé comme .mielaissa-previous. Le nouvel arbre remplace le dossier dédié et sa checksum PHP est comparée au fichier CI.
5. **Pas d'activation automatique du plugin ni de remplacement de l'accueil**. Ces opérations sont indépendantes, à valider avec le marchand.

## 5. Contrôle en production

Depuis wp-admin : vérifier plugin activé, page avec shortcode, produits réels, navigation mobile et absence d'erreurs PHP.
Si WP-CLI est disponible sur la vraie racine : utiliser wp plugin status mielaissa-storefront et wp plugin list selon les permissions.
Vérifier les liens produits et un achat test dans des conditions maîtrisées ; aucun achat réel obligatoire.
Comparer le commit déployé avec le SHA déclencheur du workflow et consigner l'exécution dans AGENT_HANDOFF.md.

## 6. Rollback plugin

En cas d'erreur, retirer ou désactiver le shortcode et désactiver l'extension depuis wp-admin si accessible. Ensuite, avec un accès SSH autorisé à WP_ROOT :

1. Définir PLUGINS comme WP_ROOT/wp-content/plugins.
2. Renommer PLUGINS/mielaissa-storefront en un répertoire d'incident (hors de la racine des plugins si possible).
3. Renommer PLUGINS/.mielaissa-previous en PLUGINS/mielaissa-storefront.
4. Vérifier le plugin et le site ; restaurer la base et les fichiers complets via la sauvegarde si l'incident va au-delà de l'extension.

Ne jamais exécuter une commande de suppression massive sans vérifier le chemin. Un nouveau déploiement écrase la version de rollback précédente : conserver des sauvegardes externes indépendantes.

## 7. Critère de succès

Exécution CI verte + job deploy vert + SHA256 distant correspondant + plugin réellement activé + page cible avec shortcode et opérations d'achat correctes. Sinon écrire “non vérifié” ou “non déployé”.
