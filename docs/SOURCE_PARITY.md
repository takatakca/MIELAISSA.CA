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

# MIELAISSA — fidélité au site source

## Directive propriétaire — copie fidèle du site existant — 2026-10-30 23:52

**Signé : Codex — assistant OpenAI.** Le propriétaire a rejeté la refonte ambre/crème et demande un clone fidèle de https://mielaissa.ca/ en Node.js. Ce correctif de périmètre prévaut sur les comptes rendus plus anciens ci-dessous.

- Garder le projet existant : marque/logo, disposition, menus, ordre des sections, textes, produits, parcours, pages et fonctions. Ne pas substituer une nouvelle direction artistique ou une nouvelle sélection de fonctions.
- Les améliorations d’images sont autorisées si elles préservent l’identité et les produits réels. Pas de faux emballage, de nouvelle marque ou d’illustrations remplaçant arbitrairement les photos.
- Le prototype éditorial actuel et ses captures sont **rejetés comme cible de migration**. Les CI vertes prouvent son fonctionnement technique, pas la ressemblance ni l’acceptation. Ne pas le publier comme clone terminé.
- Les anomalies du site source (contenu ALKA-O, doublons, redirections) doivent être relevées, sans réécriture/suppression autonome. Toute correction fonctionnelle ou de contenu doit rester distincte de la conversion fidèle.
- Première dépendance : récupérer le HTML rendu, les CSS du thème/page builder, polices et médias originaux, plus des captures source bureau/mobile. Sans ces éléments, ne pas inventer les styles manquants ni prétendre une copie visuelle exacte.
- Accès revérifiés : réseau de l’exécuteur restreint sans mielaissa.ca ; outil navigateur associé non exposé, connexion Opera antérieure en demande de reconnexion ; recherche Drive par noms MIELAISSA/Miel Aissa ne trouve pas de sauvegarde du thème. Les exports commerciaux restent aussi à obtenir.
- Prochaine action : acquérir les fichiers/captures par un accès autorisé, remplacer le prototype par les composants reproduisant le source, puis comparer chaque page et parcours aux références. Autorisation déjà donnée, aucune nouvelle refonte proposée.

### Preuves nécessaires pour déclarer la conversion fidèle

1. Inventaire complet des URLs et langues, fichiers originaux et empreintes ; aucune page oubliée derrière un nouveau menu.
2. Captures de référence et Node aux mêmes dimensions, mêmes états de navigation, consentement et panier ; comparaison visible des écarts, pas seulement des tests DOM.
3. Logo, typographie, couleurs, images, dimensions, espacements et ordre des sections repris depuis les originaux observés.
4. Compte, panier, variantes, commandes, promotions et fidélité testés avec les systèmes réels configurés ; aucun formulaire mailto présenté comme un checkout remplacé.
5. Originaux conservés, améliorations de médias documentées sans changer le produit ; erreurs source consignées séparément.

Statut : source visuelle complète manquante ; prototype précédent non conforme. Aucune copie fidèle terminée ou déployée annoncée.
