# wagtail-prose-editor-images

**Integriert Wagtails nativen Image Chooser in `django-prose-editor`. Ergänzt Editor-Assets und einen Endpunkt mit Berechtigungsprüfung für die Bild-URL; verwaltet weder Speicherung noch Renditions oder das Layout öffentlicher Seiten.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Wichtigste Funktionen

- Wagtails vorhandenen Bildauswahldialog über die Prose-Symbolleiste öffnen.
- Berechtigung für genau das ausgewählte Bild vor Rückgabe der URL prüfen.
- CSS/JavaScript über Wagtail-Admin-Hooks laden.
- Funktioniert mit der projektspezifisch aktivierten Prose-`Image`-Erweiterung.

## Voraussetzungen und Kompatibilität

- Deklarierte Abhängigkeiten: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- Die Kompatibilität von Python, Django und Wagtail muss gemeinsam geprüft werden. Die minimale Paketabhängigkeit bestätigt keine Unterstützung jeder Version.

Die Paketmetadaten deklarieren Wagtail >= 6.0. Eine minimale Abhängigkeit ist jedoch kein Kompatibilitätstest. Dieses Quellarchiv enthält keine vollständige automatisierte Matrix für alle Django-/Wagtail-Kombinationen. Prüfen Sie vor einem Produktionsupgrade die konkreten Versionen, Datenbank, Speicher-Backend und Deployment-Einstellungen in einer Staging-Umgebung.

## Installation

Installieren Sie das Paket in derselben virtuellen Umgebung wie Ihr Wagtail-Projekt:

```bash
pip install wagtail-prose-editor-images
```

Fügen Sie die Apps in der angegebenen Reihenfolge hinzu und behalten Sie die übrigen Projektabhängigkeiten bei:

```python
INSTALLED_APPS = [
    # Behalten Sie auch andere bereits benötigte Django-/Wagtail-Abhängigkeiten bei.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Erste Konfiguration

Minimales Einstiegsbeispiel. Passen Sie Modellnamen, API-Felder und URLs an Ihre Konfiguration an.

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

## Wichtige Einstellungen und Verhalten

Die englische README in diesem Verzeichnis ist die maßgebliche Referenz und enthält vollständige Einstellungstabellen und ausführliche Beispiele. Diese Übersetzung erklärt die praktische Einrichtung und die wichtigsten Sicherheitshinweise; konsultieren Sie vor Änderungen an erweiterten Einstellungen die englische Referenz.

Die vollständige Einstellungsreferenz finden Sie in der [englischen README](README.md).

### Wichtige Hinweise

Im `ProseEditorField` muss `"Image": True` aktiviert sein. Standardmäßig liefert der Endpunkt eine Wagtail-Rendition mit `width-1200` und prüft das `choose`-Recht für das konkrete Bild. Die Größe lässt sich mit `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC` ändern. Eine Rendition kann eine zusätzliche Datei belegen; bei einem Fehler wird als letzter Ausweg die Original-URL verwendet und ein Fehler protokolliert.

## Sicherheit und Betrieb

- Halten Sie Abhängigkeiten aktuell. Verwenden Sie für nutzererstelltes HTML den vorgesehenen Bereinigungs- und Ausgabepfad; geben Sie gespeicherte Kommentare oder Forenbeiträge nicht bedingungslos mit `|safe` aus.
- Prüfen Sie Migrationen und Berechtigungen mit normalen, eingeschränkten Benutzern, Moderatoren und Administratoren.
- Testen Sie bei mehreren Wagtail-Sites jede konfigurierte Domain sowie einen unbekannten Host. Wenn keine Site gefunden wird, darf eine Abfrage nicht auf Datensätze aller Sites erweitert werden.
- Behandeln Sie API-Tokens, SMTP-Zugangsdaten und private URLs als Geheimnisse. Committen Sie diese nicht in Git und veröffentlichen Sie sie nicht in Fehlerberichten.
- Sichern Sie Datenbank und Mediendateien vor Migrationen, Massenverschiebungen, Importen oder der ersten Massenveröffentlichung. Testen Sie diese Vorgänge zuerst in Staging.

## Empfohlene Kombinationen

- `wagtail-image-directories` organisiert Originale nach `year/slug`; `wagtail-mptt-comments` ist optional für Prose-Felder bei Moderatorantworten.
- Desktop Publisher und Forum benötigen dieses Paket nicht.

## Checkliste zur Überprüfung

- [ ] Installieren Sie den Kandidaten in Staging und notieren Sie Python-, Django-, Wagtail- und Datenbankversionen.
- [ ] Führen Sie `python manage.py check` und die Paketmigrationen aus.
- [ ] Prüfen Sie den Hauptablauf mit einem normalen und einem eingeschränkten Benutzer.
- [ ] Prüfen Sie Logs, Zugriffskontrolle, Caching, Backups und Wiederherstellung.

Das Archiv besteht statische Syntax- und Packaging-Prüfungen; die vollständige Django-/Wagtail-Laufzeitintegration wurde in dieser Umgebung jedoch nicht getestet. Betrachten Sie die folgende Checkliste als Freigabekriterium und nicht als Behauptung, dass jede Versionskombination getestet wurde.

## Fehlerbehebung

Wenn der Ablauf nicht funktioniert, prüfen Sie App-Konfiguration, Migrationen, URL-Reihenfolge, Benutzerrechte und Django-Logs. Vergleichen Sie Paketversion und Beispiel mit der englischen README.

## Lizenz und Support

MIT. Quellcode: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

