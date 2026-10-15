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

## Localiser la véritable installation (sans supposer le chemin)

Contexte historique non encore revérifié : MochaHost, serveur s3650.can1.stableserver.net, compte bolonca, changement de plan Reseller 15. Sur un terminal cPanel/SSH **autorisé**, rechercher les installations WordPress via une commande de lecture seule adaptée aux permissions :

    find /home/bolonca -maxdepth 6 -type f -name wp-config.php -print

Vérifier pour **chaque candidat** le site associé, par exemple avec WP-CLI :

    wp --path=/chemin/confirme option get siteurl

Ne choisir MIELAISSA_WP_ROOT qu'après avoir obtenu une URL correspondant à mielaissa.ca, les bons droits d'écriture et un backup restaurable.

## Contrôle d'intégration en lecture seule

Quand WP-CLI et une installation de test WordPress/WooCommerce sont accessibles :

    wp --path=/chemin/confirme eval-file /chemin/repository/scripts/wordpress-smoke.php

Le script refuse de s'exécuter hors WordPress et exige les deux plugins actifs. Il n'ajoute ni commandes ni clients, ne change pas les points fidélité et ne simule pas de transaction commerciale.


## Sécurité complémentaire du job SSH

En cas de discordance SHA256 sur le fichier PHP après transfert, le workflow conserve la version rejetée en .mielaissa-failed et restaure automatiquement .mielaissa-previous lorsque celle-ci existe. Ce rollback concerne **uniquement les fichiers de l'extension**, pas la base de données ni la page WordPress. Après une première installation sans version précédente, le module incriminé est retiré du chemin actif lors de cet échec et nécessite une vérification manuelle.

Le workflow vérifie maintenant aussi la plage numérique du port SSH. Ne pas activer le pipeline sans confirmer les accès et la présence d'une sauvegarde complète.

## Continuité de service et refus prudent

Si WooCommerce est désactivé ou absent, [mielaissa_storefront] affiche une indisponibilité explicite, et [mielaissa_offers] n'annonce aucun coupon non vérifiable. La commande scripts/check.sh vérifie aussi ce cas sans WordPress, distinctement du test de catalogue.
