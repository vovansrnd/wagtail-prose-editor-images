# wagtail-prose-editor-images

**Integra o seletor de imagens nativo do Wagtail ao `django-prose-editor`. Adiciona recursos do editor e um endpoint que verifica a permissão sobre a imagem selecionada; não gerencia armazenamento, rendições nem layout público.**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## Principais recursos

- Abrir o seletor de imagens do Wagtail pela barra do Prose.
- Verificar a permissão sobre a imagem específica antes de retornar sua URL.
- Carregar CSS/JavaScript pelos hooks do admin do Wagtail.
- Funciona com a extensão Prose `Image` ativada no projeto.

## Requisitos e compatibilidade

- Dependências declaradas: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- A compatibilidade entre Python, Django e Wagtail deve ser verificada em conjunto. A dependência mínima do pacote não confirma suporte a todas as versões.

Os metadados declaram no mínimo `wagtail>=6.0`; esse é o limite inferior, não uma matriz testada. O pacote fonte inclui a suíte de testes funcionais do plugin, e o stack alvo Wagtail 8.1 / Django 6.0.9 / Python 3.14 está confirmado por execuções (plugin 13/13, integração do projeto 160/160). Isso não significa que todas as combinações de `wagtail>=6.0` foram testadas — antes de atualizar produção, verifique as versões exatas, o banco de dados, o armazenamento e as configurações de implantação.

## Instalação

Instale o pacote no mesmo ambiente virtual do seu projeto Wagtail:

```bash
pip install wagtail-prose-editor-images
```

Adicione os apps nesta ordem, mantendo as demais dependências do projeto:

```python
INSTALLED_APPS = [
    # Preserve também as outras dependências Django/Wagtail já necessárias.
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## Configuração inicial

Exemplo mínimo para começar. Adapte nomes de modelos, campos da API e URLs à sua configuração.

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

## Configurações e comportamento importantes

O README em inglês deste diretório é a referência canônica e contém as tabelas completas de opções e exemplos detalhados. Esta tradução cobre a configuração prática e os avisos essenciais de segurança; consulte a referência em inglês antes de alterar opções avançadas.

Consulte o [README em inglês](README.md) para a referência completa das configurações.

### Observações importantes

Ative `"Image": True` em `ProseEditorField`. Por padrão, o endpoint retorna uma rendition do Wagtail `width-1200` e verifica a permissão `choose` para aquela imagem. O tamanho pode ser alterado com `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC`. Uma rendition pode criar um arquivo extra no disco. Em caso de falha, o comportamento é fail closed: o erro é registrado e o endpoint retorna um JSON 5xx controlado sem nenhuma URL; a URL do original nunca é usada como fallback. O manipulador de inserção do editor também não usa URLs da resposta do chooser: em caso de falha do endpoint, nada é inserido e um erro visível é exibido no admin.

## Segurança e operação

- Mantenha as dependências atualizadas. Para HTML escrito por usuários, use o fluxo previsto de sanitização e renderização; não exiba comentários ou posts armazenados com `|safe` incondicional.
- Verifique migrações e permissões com usuários comuns, restritos, moderadores e administradores.
- Em instalações multissite, teste cada domínio configurado e um host desconhecido. Se nenhum Site for encontrado, a consulta não deve abranger registros de todos os sites.
- Trate tokens de API, credenciais SMTP e URLs privadas como segredos. Não os envie ao Git nem os inclua em relatórios públicos.
- Faça backup do banco de dados e dos arquivos de mídia antes de migrações, movimentações em lote, importações ou da primeira publicação em massa. Teste primeiro em staging.

## Combinações recomendadas

- `wagtail-image-directories` organiza originais por `year/slug`; `wagtail-mptt-comments` é opcional para campos Prose de moderação.
- O publicador desktop e o fórum não precisam deste pacote.

## Lista de verificação

- [ ] Instale a versão candidata em staging e registre as versões de Python, Django, Wagtail e banco de dados.
- [ ] Execute `python manage.py check` e as migrações do pacote.
- [ ] Teste o fluxo principal com usuário comum e usuário restrito.
- [ ] Confira logs, acesso, cache, backups e restauração.

O arquivo passou pelas verificações estáticas de sintaxe e empacotamento, mas a integração completa com Django/Wagtail não foi executada neste ambiente. Trate a lista abaixo como requisito para o lançamento, não como prova de que todas as combinações foram testadas.

## Solução de problemas

Se o fluxo não funcionar, confira a configuração do app, migrações, ordem das URLs, permissões e logs do Django. Compare a versão e o exemplo com o README em inglês.

## Licença e suporte

MIT. Código-fonte: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

