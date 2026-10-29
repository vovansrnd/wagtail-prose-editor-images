# wagtail-prose-editor-images

**Intègre le sélecteur d’images natif de Wagtail à `django-prose-editor`. Ajoute les ressources de l’éditeur et un endpoint vérifiant le droit de choisir l’image ; ne gère ni le stockage, ni les renditions, ni la mise en page publique.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Fonctionnalités principales

- Ouvrir le sélecteur d’images Wagtail depuis la barre d’outils Prose.
- Vérifier le droit de choisir l’image précise avant de retourner son URL.
- Charger CSS/JavaScript via les hooks de l’administration Wagtail.
- Fonctionne avec l’extension Prose `Image` activée dans le projet.

## Prérequis et compatibilité

- Dépendances déclarées: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- La compatibilité de Python, Django et Wagtail doit être vérifiée conjointement. La dépendance minimale du paquet ne confirme pas que toutes les versions sont prises en charge.

Les métadonnées déclarent Wagtail >= 6.0, mais une dépendance minimale ne prouve pas la compatibilité. Cette archive ne contient pas de matrice automatisée complète pour toutes les combinaisons Django/Wagtail. Avant une mise à jour en production, testez les versions exactes, la base de données, le stockage et la configuration de déploiement en préproduction.

## Installation

Installez le paquet dans le même environnement virtuel que votre projet Wagtail :

```bash
pip install wagtail-prose-editor-images
```

Ajoutez les applications dans cet ordre en conservant les autres dépendances du projet :

```python
INSTALLED_APPS = [
    # Conservez également les autres dépendances Django/Wagtail déjà requises.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Configuration initiale

Exemple minimal pour démarrer. Adaptez les noms de modèles, les champs API et les URL à votre configuration.

```python
from django_prose_editor.fields import ProseEditorField
from wagtail.models import Page

class ArticlePage(Page):
    body = ProseEditorField(extensions={
        "Bold": True,
        "Italic": True,
        "Image": True,
        "Code": True,
        "CodeBlock": True,
    })
```

## Paramètres et comportement importants

Le README anglais de ce répertoire est la référence canonique et contient les tableaux complets des options et les exemples détaillés. Cette traduction couvre la mise en place pratique et les avertissements de sécurité essentiels ; consultez la référence anglaise avant de modifier les options avancées.

Consultez le [README en anglais](README.md) pour la référence complète des paramètres.

### Points importants

Activez `"Image": True` dans `ProseEditorField`. Par défaut, l’endpoint renvoie une rendition Wagtail `width-1200` et vérifie le droit `choose` pour cette image. La taille peut être modifiée avec `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Une rendition peut créer un fichier supplémentaire ; en cas d’échec, l’erreur est journalisée et l’URL originale est utilisée en dernier recours.

## Sécurité et exploitation

- Maintenez les dépendances à jour. Pour le HTML utilisateur, utilisez le chemin prévu de nettoyage et de rendu ; n’affichez pas les commentaires ou messages stockés avec un `|safe` inconditionnel.
- Vérifiez migrations et autorisations avec des utilisateurs normaux, restreints, modérateurs et administrateurs.
- En environnement multisite, testez chaque domaine configuré ainsi qu’un hôte inconnu. Si aucun Site n’est trouvé, une requête ne doit jamais s’élargir à tous les sites.
- Traitez les jetons API, identifiants SMTP et URL privées comme des secrets. Ne les committez pas dans Git et ne les publiez pas dans les rapports de bug.
- Sauvegardez la base de données et les fichiers médias avant les migrations, déplacements en masse, imports ou première publication en masse. Testez d’abord en préproduction.

## Combinaisons recommandées

- `wagtail-image-directories` organise les originaux par `year/slug` ; `wagtail-mptt-comments` est facultatif pour les champs Prose de modération.
- Le publieur de bureau et le forum n’ont pas besoin de ce paquet.

## Liste de vérification

- [ ] Installez la version candidate en préproduction et notez les versions de Python, Django, Wagtail et de la base de données.
- [ ] Exécutez `python manage.py check` et les migrations du paquet.
- [ ] Testez le flux principal avec un utilisateur normal et un utilisateur restreint.
- [ ] Vérifiez journaux, accès, cache, sauvegardes et restauration.

L’archive passe les contrôles statiques de syntaxe et de packaging, mais l’intégration Django/Wagtail complète n’a pas été exécutée dans cet environnement. Considérez la liste ci-dessous comme une condition de publication, et non comme la preuve que toutes les combinaisons sont testées.

## Dépannage

Si le flux ne fonctionne pas, vérifiez la configuration de l’application, les migrations, l’ordre des URL, les autorisations et les journaux Django. Comparez la version et l’exemple avec le README anglais.

## Licence et assistance

MIT. Code source: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

