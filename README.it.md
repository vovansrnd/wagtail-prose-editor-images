# wagtail-prose-editor-images

**Integra il selettore immagini nativo di Wagtail con `django-prose-editor`. Aggiunge risorse dell’editor e un endpoint che verifica il permesso sull’immagine selezionata; non gestisce storage, rendition o layout pubblico.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Funzionalità principali

- Aprire il selettore immagini Wagtail dalla barra Prose.
- Verificare il permesso sulla specifica immagine prima di restituirne l’URL.
- Caricare CSS/JavaScript tramite gli hook dell’admin Wagtail.
- Funziona con l’estensione Prose `Image` abilitata nel progetto.

## Requisiti e compatibilità

- Dipendenze dichiarate: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- La compatibilità di Python, Django e Wagtail va verificata congiuntamente. La dipendenza minima del pacchetto non conferma il supporto di tutte le versioni.

I metadati dichiarano Wagtail >= 6.0, ma una dipendenza minima non dimostra la compatibilità. Questo archivio non contiene una matrice automatizzata completa per tutte le combinazioni Django/Wagtail. Prima di aggiornare la produzione, verifica in staging le versioni effettive, il database, lo storage e le impostazioni di deployment.

## Installazione

Installa il pacchetto nello stesso ambiente virtuale del progetto Wagtail:

```bash
pip install wagtail-prose-editor-images
```

Aggiungi le app nell’ordine indicato mantenendo le altre dipendenze del progetto:

```python
INSTALLED_APPS = [
    # Mantieni anche le altre dipendenze Django/Wagtail già necessarie.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Configurazione iniziale

Esempio minimo per iniziare. Adatta nomi dei modelli, campi API e URL alla tua configurazione.

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

## Impostazioni e comportamento importanti

Il README inglese in questa directory è il riferimento canonico e contiene le tabelle complete delle opzioni e gli esempi estesi. Questa traduzione copre la configurazione pratica e gli avvisi di sicurezza essenziali; consulta il riferimento inglese prima di modificare le opzioni avanzate.

Consulta il [README inglese](README.md) per la tabella completa delle impostazioni.

### Note importanti

Attiva `"Image": True` in `ProseEditorField`. Per impostazione predefinita, l’endpoint restituisce una rendition Wagtail `width-1200` e verifica il permesso `choose` per quella specifica immagine. La dimensione si può cambiare con `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Una rendition può creare un file aggiuntivo; in caso di errore, l’endpoint registra l’eccezione e usa l’URL originale solo come ultima risorsa.

## Sicurezza e operatività

- Mantieni aggiornate le dipendenze. Per l’HTML degli utenti usa il percorso previsto di sanificazione e rendering; non mostrare commenti o post salvati con `|safe` incondizionato.
- Verifica migrazioni e permessi con utenti normali, limitati, moderatori e amministratori.
- Nei progetti multi-sito, verifica ogni dominio configurato e un host sconosciuto. Se non viene trovato un Site, la query non deve estendersi ai record di tutti i siti.
- Tratta token API, credenziali SMTP e URL privati come segreti. Non inserirli in Git né in segnalazioni pubbliche.
- Esegui il backup del database e dei file multimediali prima di migrazioni, spostamenti in blocco, importazioni o pubblicazioni massive iniziali. Prova prima in staging.

## Combinazioni consigliate

- `wagtail-image-directories` organizza gli originali per `year/slug`; `wagtail-mptt-comments` è opzionale per campi Prose di moderazione.
- Publisher desktop e forum non richiedono questo pacchetto.

## Lista di verifica

- [ ] Installa la versione candidata in staging e annota le versioni di Python, Django, Wagtail e database.
- [ ] Esegui `python manage.py check` e le migrazioni del pacchetto.
- [ ] Prova il flusso principale con un utente normale e uno limitato.
- [ ] Controlla log, accessi, cache, backup e ripristino.

L’archivio supera i controlli statici di sintassi e packaging, ma in questo ambiente non è stato eseguito un test completo d’integrazione Django/Wagtail. Considera la lista seguente un requisito per il rilascio, non la prova che ogni combinazione sia stata testata.

## Risoluzione dei problemi

Se il flusso non funziona, controlla configurazione dell’app, migrazioni, ordine URL, permessi e log Django. Confronta versione ed esempio con il README inglese.

## Licenza e supporto

MIT. Codice sorgente: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

