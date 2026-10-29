# wagtail-prose-editor-images

**Integruje natywny selektor obrazów Wagtail z `django-prose-editor`. Dodaje zasoby edytora i endpoint sprawdzający uprawnienia do wybranego obrazu; nie zarządza przechowywaniem, rendycjami ani układem strony publicznej.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Najważniejsze funkcje

- Otwieranie wbudowanego selektora obrazów Wagtail z paska Prose.
- Sprawdzanie uprawnień do konkretnego obrazu przed zwróceniem jego URL.
- Ładowanie CSS/JavaScript przez hooki panelu Wagtail.
- Współpracuje z włączonym w projekcie rozszerzeniem Prose `Image`.

## Wymagania i zgodność

- Zadeklarowane zależności: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- Zgodność Pythona, Django i Wagtail należy sprawdzać łącznie. Minimalna zależność pakietu nie potwierdza obsługi każdej wersji.

Metadane deklarują Wagtail >= 6.0, ale minimalna zależność nie dowodzi zgodności. Archiwum nie zawiera pełnej automatycznej macierzy wszystkich kombinacji Django/Wagtail. Przed aktualizacją produkcji sprawdź dokładne wersje, bazę danych, backend plików i konfigurację wdrożenia na środowisku testowym.

## Instalacja

Zainstaluj pakiet w tym samym środowisku wirtualnym co projekt Wagtail:

```bash
pip install wagtail-prose-editor-images
```

Dodaj aplikacje w tej kolejności, zachowując pozostałe zależności projektu:

```python
INSTALLED_APPS = [
    # Zachowaj również inne zależności Django/Wagtail wymagane przez projekt.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Pierwsza konfiguracja

Minimalny przykład na początek. Dostosuj nazwy modeli, pola API i adresy URL do swojej konfiguracji.

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

## Ważne ustawienia i zachowanie

Angielski README w tym katalogu jest kanoniczną dokumentacją i zawiera pełne tabele opcji oraz rozszerzone przykłady. To tłumaczenie opisuje praktyczną konfigurację i najważniejsze ostrzeżenia bezpieczeństwa; przed zmianą zaawansowanych opcji sprawdź dokumentację angielską.

Pełną tabelę ustawień znajdziesz w [angielskim README](README.md).

### Ważne uwagi

W `ProseEditorField` włącz `"Image": True`. Domyślnie endpoint zwraca rendition Wagtail `width-1200` i sprawdza uprawnienie `choose` dla konkretnego obrazu. Rozmiar można zmienić przez `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Rendition może utworzyć dodatkowy plik; przy błędzie endpoint zapisuje wyjątek w logu i używa URL oryginału jako rozwiązania awaryjnego.

## Bezpieczeństwo i eksploatacja

- Aktualizuj zależności. Dla HTML użytkowników stosuj przewidziany mechanizm oczyszczania i renderowania; nie wyświetlaj zapisanych komentarzy ani postów bezwarunkowo przez `|safe`.
- Sprawdź migracje i uprawnienia jako zwykły, ograniczony użytkownik, moderator i administrator.
- W instalacji wieloserwisowej przetestuj każdą skonfigurowaną domenę i nieznany host. Brak Site nie może rozszerzać zapytania na rekordy wszystkich witryn.
- Traktuj tokeny API, dane SMTP i prywatne adresy URL jako sekrety. Nie dodawaj ich do Git ani do publicznych zgłoszeń.
- Wykonaj kopię zapasową bazy i plików multimedialnych przed migracjami, masowym przenoszeniem, importem lub pierwszą masową publikacją. Najpierw przetestuj te operacje na stagingu.

## Zalecane połączenia

- `wagtail-image-directories` porządkuje oryginały według `year/slug`; `wagtail-mptt-comments` jest opcjonalny dla pól Prose odpowiedzi moderatorów.
- Publisher desktopowy i forum nie wymagają tego pakietu.

## Lista kontrolna

- [ ] Zainstaluj wersję kandydującą na stagingu i zapisz wersje Pythona, Django, Wagtail oraz bazy.
- [ ] Uruchom `python manage.py check` i migracje pakietu.
- [ ] Przetestuj główny przepływ jako zwykły i ograniczony użytkownik.
- [ ] Sprawdź logi, dostęp, cache, kopie zapasowe i odtwarzanie.

Archiwum przechodzi statyczne kontrole składni i pakowania, ale w tym środowisku nie wykonano pełnych testów integracyjnych Django/Wagtail. Poniższą listę traktuj jako warunek wydania, a nie potwierdzenie przetestowania każdej kombinacji.

## Rozwiązywanie problemów

Jeśli przepływ nie działa, sprawdź konfigurację aplikacji, migracje, kolejność URL, uprawnienia i logi Django. Porównaj wersję pakietu i przykład z angielskim README.

## Licencja i pomoc

MIT. Kod źródłowy: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

