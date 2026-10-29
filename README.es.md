# wagtail-prose-editor-images

**Integra el selector nativo de imágenes de Wagtail con `django-prose-editor`. Añade recursos del editor y un endpoint que verifica el permiso sobre la imagen seleccionada; no gestiona almacenamiento, rendiciones ni el diseño público.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Funciones principales

- Abrir el selector de imágenes existente de Wagtail desde la barra de Prose.
- Comprobar el permiso para elegir la imagen concreta antes de devolver su URL.
- Cargar CSS/JavaScript mediante hooks del administrador de Wagtail.
- Funciona con la extensión Prose `Image` habilitada en el proyecto.

## Requisitos y compatibilidad

- Dependencias declaradas: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- La compatibilidad de Python, Django y Wagtail debe verificarse en conjunto. La dependencia mínima del paquete no confirma que todas las versiones estén soportadas.

Los metadatos declaran Wagtail >= 6.0, pero una dependencia mínima no demuestra compatibilidad. Este archivo no incluye una matriz automatizada completa para todas las combinaciones de Django/Wagtail. Antes de actualizar producción, prueba las versiones exactas, la base de datos, el almacenamiento y la configuración de despliegue en un entorno de pruebas.

## Instalación

Instala el paquete en el mismo entorno virtual que tu proyecto Wagtail:

```bash
pip install wagtail-prose-editor-images
```

Añade las aplicaciones en el orden indicado y conserva las demás dependencias del proyecto:

```python
INSTALLED_APPS = [
    # Conserva también las demás dependencias Django/Wagtail que necesita el proyecto.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Configuración inicial

Ejemplo mínimo para empezar. Adapta los nombres de modelos, campos API y URL a tu configuración.

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

## Ajustes y comportamiento importantes

El README en inglés de este directorio es la referencia canónica y contiene las tablas completas de opciones y ejemplos ampliados. Esta traducción cubre la configuración práctica y las advertencias de seguridad esenciales; consulta la referencia inglesa antes de cambiar opciones avanzadas.

Consulta la [versión inglesa del README](README.md) para ver la referencia completa de ajustes.

### Notas importantes

Activa `"Image": True` en `ProseEditorField`. De forma predeterminada, el endpoint devuelve una versión de Wagtail `width-1200` y comprueba el permiso `choose` para esa imagen. Puedes cambiar el tamaño con `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Una versión derivada puede crear otro archivo en disco; si falla su generación, el endpoint registra el error y usa la URL original como último recurso.

## Seguridad y operación

- Mantén las dependencias actualizadas. Para HTML escrito por usuarios, utiliza la limpieza y representación previstas; no muestres comentarios o publicaciones almacenadas con `|safe` incondicional.
- Comprueba migraciones y permisos con usuarios normales, restringidos, moderadores y administradores.
- En instalaciones multisitio, prueba cada dominio configurado y un host desconocido. Si no se encuentra un Site, la consulta nunca debe ampliarse a todos los sitios.
- Trata los tokens de API, las credenciales SMTP y las URL privadas como secretos. No los guardes en Git ni los incluyas en informes públicos.
- Haz copias de seguridad de la base de datos y de los medios antes de migraciones, movimientos masivos, importaciones o la primera publicación masiva. Prueba primero en staging.

## Combinaciones recomendadas

- `wagtail-image-directories` organiza originales por `year/slug`; `wagtail-mptt-comments` es opcional para campos Prose de moderación.
- El publicador de escritorio y el foro no requieren este paquete.

## Lista de verificación

- [ ] Instala la versión candidata en staging y anota las versiones de Python, Django, Wagtail y la base de datos.
- [ ] Ejecuta `python manage.py check` y las migraciones del paquete.
- [ ] Prueba el flujo principal con un usuario normal y otro restringido.
- [ ] Revisa registros, acceso, caché, copias de seguridad y recuperación.

El archivo supera comprobaciones estáticas de sintaxis y empaquetado, pero no se ha ejecutado aquí una prueba completa de integración Django/Wagtail. Trata la lista siguiente como un requisito previo a la publicación, no como una afirmación de que se han probado todas las combinaciones.

## Solución de problemas

Si el flujo no funciona, revisa la configuración de la app, las migraciones, el orden de URL, los permisos y los registros de Django. Compara la versión y el ejemplo con el README inglés.

## Licencia y soporte

MIT. Código fuente: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

