# wagtail-prose-editor-images

**Integreert de native Wagtail Image Chooser met `django-prose-editor`. Voegt editor-assets en een endpoint toe dat het recht om de gekozen afbeelding te selecteren controleert; beheert geen opslag, renditions of publieke paginaopmaak.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Belangrijkste functies

- De bestaande Wagtail-afbeeldingskiezer openen vanuit de Prose-werkbalk.
- Recht om precies die afbeelding te kiezen controleren voordat de URL wordt teruggegeven.
- CSS/JavaScript laden via Wagtail-adminhooks.
- Werkt met de Prose-`Image`-extensie die in het project is ingeschakeld.

## Vereisten en compatibiliteit

- Gedeclareerde afhankelijkheden: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- Controleer de compatibiliteit van Python, Django en Wagtail gezamenlijk. De minimale pakketafhankelijkheid bewijst niet dat alle versies worden ondersteund.

De pakketmetadata declareert minimaal `wagtail>=6.0`; dat is de ondergrens, geen geteste matrix. Het bronpakket bevat de functionele regressiontestsuite van de plugin, en de doel-stack Wagtail 8.1 / Django 6.0.9 / Python 3.14 is bevestigd door testruns (plugin 15/15, projectintegratie 160/160). Dat betekent niet dat alle `wagtail>=6.0`-combinaties getest zijn — test vóór een productie-upgrade de exacte versies, database, opslagbackend en deploymentinstellingen.

## Installatie

Installeer het pakket in dezelfde virtuele omgeving als je Wagtail-project:

```bash
pip install wagtail-prose-editor-images
```

Voeg de apps in deze volgorde toe en behoud de overige projectafhankelijkheden:

```python
INSTALLED_APPS = [
    # Behoud ook de overige Django/Wagtail-afhankelijkheden die het project nodig heeft.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Eerste configuratie

Minimaal startvoorbeeld. Pas modelnamen, API-velden en URL’s aan je configuratie aan.

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

## Belangrijke instellingen en gedrag

De Engelse README in deze map is de canonieke referentie met volledige instellingstabellen en uitgebreide voorbeelden. Deze vertaling behandelt de praktische installatie en de belangrijkste veiligheidswaarschuwingen; raadpleeg de Engelse referentie voordat je geavanceerde instellingen wijzigt.

Raadpleeg de [Engelse README](README.md) voor het volledige instellingenoverzicht.

### Belangrijke aandachtspunten

Schakel `"Image": True` in bij `ProseEditorField`. Standaard geeft het endpoint een Wagtail-rendition met `width-1200` terug en controleert het het `choose`-recht voor die afbeelding. De maat is instelbaar met `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Een rendition kan een extra bestand op schijf maken. Bij een fout is het gedrag fail closed: de fout wordt gelogd en het endpoint geeft een gecontroleerde 5xx-JSON zonder enige URL terug; de originele URL wordt nooit als terugval gebruikt. De invoeghandler van de editor gebruikt evenmin URLs uit de chooser-reactie: bij een endpointfout wordt niets ingevoegd en verschijnt een zichtbare foutmelding in de admin.

## Beveiliging en beheer

- Houd afhankelijkheden bijgewerkt. Gebruik voor door gebruikers geschreven HTML het bedoelde opschonings- en renderpad; geef opgeslagen reacties of forumberichten niet onvoorwaardelijk weer met `|safe`.
- Controleer migraties en rechten met gewone, beperkte gebruikers, moderators en beheerders.
- Test bij meerdere sites elk ingesteld domein en een onbekende host. Als geen Site wordt gevonden, mag een query niet worden verbreed naar records van alle sites.
- Behandel API-tokens, SMTP-inloggegevens en privé-URL’s als geheimen. Commit ze niet naar Git en vermeld ze niet in openbare bugrapporten.
- Maak een back-up van database en mediabestanden vóór migraties, bulkverplaatsingen, imports of de eerste bulkpublicatie. Test zulke handelingen eerst in staging.

## Aanbevolen combinaties

- `wagtail-image-directories` organiseert originelen per `year/slug`; `wagtail-mptt-comments` is optioneel voor Prose-velden bij moderatiereacties.
- Desktop publisher en forum vereisen dit pakket niet.

## Controlelijst

- [ ] Installeer de kandidaat in staging en noteer de Python-, Django-, Wagtail- en databaseversies.
- [ ] Voer `python manage.py check` en de pakketmigraties uit.
- [ ] Test de hoofdworkflow met een gewone en beperkte gebruiker.
- [ ] Controleer logs, toegang, caching, back-ups en herstel.

Het archief slaagt voor statische syntax- en packagingcontroles, maar volledige Django/Wagtail-runtime-integratie is hier niet uitgevoerd. Beschouw de lijst hieronder als vrijgavevoorwaarde, niet als bewijs dat elke combinatie is getest.

## Probleemoplossing

Als de workflow niet werkt, controleer appconfiguratie, migraties, URL-volgorde, gebruikersrechten en Django-logs. Vergelijk pakketversie en voorbeeld met de Engelse README.

## Licentie en ondersteuning

MIT. Broncode: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

