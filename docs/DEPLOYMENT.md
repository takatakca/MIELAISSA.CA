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


## Contrôles supplémentaires en amont du transfert (15 octobre 2026)

Le chemin de WordPress peut contenir un nom de domaine avec des points ; `scripts/validate-wordpress-root.sh` autorise ce format mais refuse les composants `.`, `..`, chemins relatifs et caractères pouvant injecter une commande. Des tests négatifs positifs sont intégrés dans `scripts/test-deployment-config.sh`.

Le workflow `workflow_run` doit provenir d'une CI réussie sur push main du même dépôt et du SHA attendu. Avant le premier transfert, il exige maintenant WP-CLI sur le serveur cible et lit `wp --path=... --skip-plugins --skip-themes option get home`. Seuls les domaines exacts `mielaissa.ca` et `www.mielaissa.ca` sont acceptés (HTTP ou HTTPS). Cela évite un transfert accidentel sur une autre boutique partageant le même compte cPanel.

**Si WP-CLI est absent ou la valeur WordPress home ne correspond pas :** la publication est interrompue sans écriture du plugin. La solution est de préparer le préflight d'hébergement, pas de désactiver le contrôle.

## Surveillance publique indépendante

`.github/workflows/public-health.yml` planifie quotidiennement `bash scripts/public-health.sh` et permet `workflow_dispatch`. Le script vérifie le HTTP 200 et une page HTML identifiant Miel Aissa, tout en détectant quelques erreurs fatales WordPress. Il ne lit ni client ni commande et ne vérifie **pas** les shortcodes / l'activation du plugin. Les notifications d'échec de workflow sont gérées par GitHub selon la configuration du compte.


## Anti-déploiement d'une révision supplantée

Le SHA publié par le workflow_run doit correspondre au HEAD de main au début du job. Un contrôle **supplémentaire** exécute maintenant `git ls-remote --heads origin refs/heads/main` après le checkout et avant la phase SSH. Si une nouvelle révision a remplacé la révision validée entre le déclenchement de la CI et le démarrage du déploiement, le job refuse de publier la version devenue obsolète.

Ce contrôle ne change pas les autres obligations : validité du site WordPress cible, sauvegarde/restauration, staging, vérification de la clé hôte et variable d'activation volontaire.


## Manifeste intégral de l'extension (16 octobre 2026)

`scripts/plugin-manifest.sh DOSSIER_PLUGIN` vérifie la présence du fichier PHP, du CSS et du JS puis renvoie un manifeste SHA256 trié de **tous** les fichiers de l'extension. Après `rsync` vers le dossier provisoire, le workflow compare les manifestes local et distant avant de remplacer le plugin courant. Il effectue une deuxième comparaison après bascule et revient au plugin précédent en cas de discordance.

`scripts/test-plugin-manifest.sh` vérifie localement : manifestes identiques pour copies identiques, différence après altération JavaScript, erreur lors de la disparition de CSS. Ce test ne remplace pas un déploiement SSH réellement vérifié.

Le workflow `public-health.yml` s'exécute désormais sur chaque push `main` et quotidiennement. Son succès signifie seulement que `https://mielaissa.ca/` a rendu une page HTML identifiable, pas que le ZIP actuel a été activé. Ne jamais déclarer la production prête sur la base du seul health check.

Les blocages d'accès à WP-CLI, cPanel, SSH, staging et sauvegardes restent inchangés.
