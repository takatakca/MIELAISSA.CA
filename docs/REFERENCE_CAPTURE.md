# Acquisition des fichiers source MIELAISSA

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

