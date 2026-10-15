# File de travail exécutable — MIELAISSA.CA

Ordre de priorité. Les items marqués en attente ne peuvent pas être considérés comme terminés sans preuve.

## P0 — Publication de la version réellement fonctionnelle

- [x] Reprendre le code existant et inventorier les workflows GitHub.
- [x] Corriger le filtrage des produits invisibles et les coupons épuisés.
- [x] Ajouter un indicateur d'indisponibilité produit et ses tests.
- [x] Protéger la publication par le résultat CI, SHA de main et rollback de plugin.
- [x] Ajouter AGENTS.md et les cinq fichiers de relève/exploitation.
- [ ] Confirmer accès WordPress, thème, WooCommerce, version PHP, environnement staging, sauvegarde et chemin exact du site auprès d'un accès autorisé.
- [ ] Installer le ZIP sur staging, activer et tester [mielaissa_storefront] et [mielaissa_offers].
- [ ] Vérifier simple/variable, pagination catalogue si nécessaire, rupture de stock, promotions, responsive FR/EN, navigation clavier et compatibilité thème.
- [ ] Vérifier commandes test/cart/paiement avec les méthodes réellement configurées, sans prélever de paiement réel.
- [ ] Vérifier restauration site et base, droits d'écriture limités, empreinte de clé SSH et variables GitHub Actions.
- [ ] Activer la publication uniquement après ces garanties et vérifier SHA distant, plugin activé, page intégrée et expérience client finale.
- [ ] Documenter lien de version publiée, preuve de déploiement, résultats tests et rollback.

## P1 — Fonctionnalités additionnelles à cadrer avec le marchand

- [ ] Confirmer l'identité visuelle officielle, médias licenciés, contenu et coordonnées.
- [ ] Définir la place des promotions et les mentions légales précises selon les règles de coupons du marchand.
- [ ] Évaluer le SEO technique, la vitesse, la conformité accessibilité WCAG, langues officielles et pages essentielles du site réel.
- [ ] Documenter si une intégration TAKATAK est nécessaire ; spécifier permissions tenant-scoped et consentement avant code.

## Procédure de reprise

Lire AGENTS.md, docs/AGENT_HANDOFF.md, puis chercher le **premier item faisable**, sans tenter d'inventer des accès. Pour les items bloqués, consigner le blocage et poursuivre les tâches de code indépendantes.
