# Repository video assets

リポジトリ別のMP4・PPTX素材を保管するディレクトリです。Next.jsの`public`外に置き、Vercelの配信成果物を軽量に保ちます。

ブログ上の動画は、検証済みのGitコミットを指定したCDN URLから配信します。新しい素材を追加・更新した場合は、`app/lib/video-assets.ts`のコミットIDも更新してください。
