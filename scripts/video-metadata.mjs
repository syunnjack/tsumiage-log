/**
 * リポジトリ動画のタイトル・説明文・タグを組み立てる。
 *
 * 動画は45〜75秒と短いため、YouTubeのチャプター（1区間10秒以上×3つ以上）は
 * 成立しない。そのため効くのは次の4点に絞られる。
 *
 *   検索  : タイトル前半に技術名を置く。リポジトリ名だけでは誰も検索しない
 *   AI要約: 説明文の冒頭2文で「何を作ったか」「何が分かるか」を言い切る
 *   タグ  : 言語と用途を機械可読な形で持たせる
 *   参加  : 具体的な問いかけを入れてコメントを促す
 */

const TAG_LIMIT = 500; // YouTubeのtagsは合計500文字まで

/** 言語名から検索されやすい表記を足す（例: TypeScript -> TypeScript, TS） */
const LANGUAGE_ALIASES = {
  TypeScript: ["TypeScript"],
  JavaScript: ["JavaScript"],
  PHP: ["PHP", "Laravel"],
  Python: ["Python"],
  HTML: ["HTML"],
  CSS: ["CSS"],
  Blade: ["Laravel", "Blade"],
  Astro: ["Astro"],
  Vue: ["Vue"],
  Shell: ["シェルスクリプト"],
};

/**
 * コメントを促す問いかけ。147本すべてで同じ文だと機械的に見えるため、
 * 連番で切り替える。
 */
const QUESTIONS = [
  "同じ構成で作るとしたら、どの部分から手をつけますか。",
  "この構成で「ここは自分なら変える」という点があれば教えてください。",
  "似たものを作った方がいれば、どんな技術を選んだか聞かせてください。",
  "この規模なら、どのくらいの期間で作れると思いますか。",
  "使っている技術のなかで、気になるものはありましたか。",
  "個人開発で毎回悩むのは設計ですが、みなさんはどう決めていますか。",
];

/** ファイル名から、視聴者が「どこを読めばいいか」に変換する */
function readingPoints(files) {
  const meaningful = files.filter((f) => !/^(AGENTS|CLAUDE)\.md$/i.test(f));
  const picked = (meaningful.length ? meaningful : files).slice(0, 3);
  return picked.length ? picked.join("、") : "READMEと主要なソースファイル";
}

export function buildTitle(article) {
  const { displayName, primaryLanguage } = article;
  // 技術名を前に出す。「Reserve Serapi」だけでは検索されないが
  // 「TypeScript 個人開発」なら検索される
  const lead = primaryLanguage && primaryLanguage !== "不明" ? `${primaryLanguage}で作った` : "";
  return `${lead}${displayName}｜構成とコミット履歴を75秒で解説`;
}

export function buildTags(article) {
  const langs = article.languages.length ? article.languages : [article.primaryLanguage];
  const expanded = langs.flatMap((l) => LANGUAGE_ALIASES[l] ?? [l]);

  const candidates = [
    "個人開発",
    "技術解説",
    "プログラミング",
    "ソースコード",
    "GitHub",
    "開発記録",
    ...expanded,
    article.displayName,
    `${article.primaryLanguage} 個人開発`,
  ];

  const tags = [];
  let length = 0;
  for (const tag of [...new Set(candidates)].filter(Boolean)) {
    if (length + tag.length + 1 > TAG_LIMIT) break;
    tags.push(tag);
    length += tag.length + 1;
  }
  return tags;
}

export function buildDescription(article, index = 0) {
  const { displayName, languages, primaryLanguage, files, slug, url } = article;
  const langText = languages.length ? languages.join("・") : primaryLanguage;
  const articleUrl = `https://syunnjack.dev/articles/${slug}`;
  const question = QUESTIONS[index % QUESTIONS.length];
  const hashLang = (primaryLanguage || "").replace(/[^\p{L}\p{N}]/gu, "");

  return [
    // 冒頭2文。検索結果とAIの要約に使われるのはここなので、
    // 何を作ったか・何が分かるかを言い切る
    `${displayName}は、${langText}で作った個人開発のプロジェクトです。この動画では、公開リポジトリのファイル構成、使用技術の役割、直近のコミットから読み取れる改善の流れを75秒で紹介します。`,
    "",
    "▼ この動画で分かること",
    `・${displayName}がどんな技術で組まれているか（${langText}）`,
    `・リポジトリのどこを読むと設計が分かるか（${readingPoints(files)}）`,
    "・直近のコミットで何が改善されたか",
    "",
    "▼ リンク",
    `くわしい解説記事： ${articleUrl}`,
    `ソースコード（GitHub）： ${url}`,
    "ブログ『積み上げログ』： https://syunnjack.dev/",
    "",
    "▼ コメントで教えてください",
    question,
    "",
    "『積み上げログ』は、個人開発でつくったものの設計と、そこから学んだことを記事と動画で残しているチャンネルです。同じような構成で作ってみたい方の手がかりになればうれしいです。",
    "",
    `#個人開発 #${hashLang} #技術解説 #プログラミング #GitHub`,
  ].join("\n");
}

/** アップロード時に使う一式 */
export function buildVideoMetadata(article, index = 0) {
  return {
    title: buildTitle(article),
    youtubeDescription: buildDescription(article, index),
    tags: buildTags(article),
    // 言語ごとに再生リストへ振り分けると、関連動画として回遊しやすくなる
    playlist: `${article.primaryLanguage}の個人開発`,
  };
}
