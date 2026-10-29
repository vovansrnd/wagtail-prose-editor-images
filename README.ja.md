# wagtail-prose-editor-images

**Wagtail 標準の画像選択機能を `django-prose-editor` に統合します。エディター用アセットと、選択画像の権限を確認するエンドポイントを追加します。ストレージ、レンディション、公開ページのレイアウトは管理しません。**

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Português (Brasil)](README.pt-BR.md) · [Nederlands](README.nl.md) · [Polski](README.pl.md) · [Türkçe](README.tr.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

## 主な機能

- Prose ツールバーから Wagtail 標準の画像選択ダイアログを開く。
- URL を返す前に、対象画像を選択する権限を確認する。
- Wagtail 管理画面の hook で CSS/JavaScript を読み込む。
- プロジェクトで有効にした Prose `Image` 拡張と連携する。

## 要件と互換性

- 宣言されている依存関係: `Wagtail >= 6.0; django-prose-editor >= 0.26`.
- Python、Django、Wagtail の互換性は組み合わせて確認してください。最低依存バージョンは全バージョンのサポートを意味しません。

パッケージのメタデータでは Wagtail >= 6.0 を宣言していますが、最小依存バージョンは全バージョンでの互換性を保証しません。このアーカイブには、すべての Django/Wagtail 組み合わせを網羅する自動テストマトリクスはありません。本番環境を更新する前に、正確なバージョン、データベース、ストレージバックエンド、デプロイ設定をステージングで確認してください。

## インストール

Wagtail プロジェクトと同じ仮想環境にパッケージをインストールします。

```bash
pip install wagtail-prose-editor-images
```

プロジェクトで必要な他の依存関係を維持しながら、次の順序でアプリを追加します。

```python
INSTALLED_APPS = [
    # プロジェクトで必要な他の Django/Wagtail 依存関係も維持してください。
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
]
```


## 初期設定

以下は最小の開始例です。モデル名、API フィールド、URL は実際の構成に合わせてください。

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

## 重要な設定と動作

このディレクトリの英語 README が正式な基準ドキュメントで、設定表と詳細例をすべて含みます。この翻訳では実際の導入手順と重要な安全上の注意を説明します。高度な設定を変更する前に英語版を確認してください。

設定の完全な一覧は[英語 README](README.md)を参照してください。

### 重要な注意事項

`ProseEditorField` で `"Image": True` を有効にしてください。エンドポイントは既定で Wagtail の `width-1200` レンディション URL を返し、対象画像の `choose` 権限を確認します。サイズは `WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC` で変更できます。レンディションは追加ファイルを作成する場合があります。生成に失敗するとログを記録し、最後の手段としてオリジナル URL を返します。

## セキュリティと運用

- 依存関係を最新に保ってください。ユーザー作成 HTML には定められたサニタイズ/レンダリング経路を使い、保存済みコメントやフォーラム投稿を無条件に `|safe` で表示しないでください。
- 通常ユーザー、制限ユーザー、モデレーター、管理者でマイグレーションと権限を確認してください。
- マルチサイト環境では、設定済みのすべてのホストと未設定のホストをテストしてください。Site を特定できない場合、全サイトのレコードに検索範囲を拡張してはいけません。
- API トークン、SMTP 認証情報、非公開 URL は秘密情報として扱ってください。Git にコミットしたり、公開の不具合報告に含めたりしないでください。
- マイグレーション、大量移動、インポート、初回の一括公開の前に、データベースとメディアファイルをバックアップし、まずステージングで実行してください。

## 推奨構成

- `wagtail-image-directories` は `year/slug` でオリジナルを整理します。モデレーター返信の Prose フィールドで画像選択が必要なら `wagtail-mptt-comments` は任意です。
- デスクトップパブリッシャーやフォーラムには不要です。

## 確認チェックリスト

- [ ] ステージングに候補版を導入し、Python、Django、Wagtail、DB の各バージョンを記録する。
- [ ] `python manage.py check` とパッケージのマイグレーションを実行する。
- [ ] 通常ユーザーと制限ユーザーで主要な操作を試す。
- [ ] ログ、アクセス制御、キャッシュ、バックアップ、復元を確認する。

このアーカイブは静的な構文・パッケージチェックに合格していますが、この環境では Django/Wagtail の完全な実行時統合テストを行っていません。以下の項目は全組み合わせのテスト済みという意味ではなく、リリース前の必須確認事項です。

## トラブルシューティング

動作しない場合は、アプリ設定、マイグレーション、URL の順序、ユーザー権限、Django ログを確認してください。パッケージ版と例を英語 README と照合してください。

## ライセンスとサポート

MIT. ソースコード: [https://github.com/vovansrnd/wagtail-prose-editor-images](https://github.com/vovansrnd/wagtail-prose-editor-images).

