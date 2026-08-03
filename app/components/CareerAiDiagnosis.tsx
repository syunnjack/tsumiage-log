"use client"

import Link from "next/link"
import { useRef, useState } from "react"

type RouteId = "career" | "side-business" | "school" | "certification"

type DiagnosisOption = {
  label: string
  scores: Partial<Record<RouteId, number>>
}

type DiagnosisQuestion = {
  id: string
  title: string
  options: DiagnosisOption[]
}

const questions: DiagnosisQuestion[] = [
  {
    id: "goal",
    title: "今、最も実現したいことは何ですか？",
    options: [
      { label: "IT業界へ転職したい", scores: { career: 5 } },
      { label: "本業を続けながら副収入を作りたい", scores: { "side-business": 5 } },
      { label: "将来はフリーランスとして独立したい", scores: { "side-business": 5, career: 1 } },
      { label: "基礎から体系的に学び直したい", scores: { school: 5, certification: 1 } },
      { label: "資格で知識やスキルを証明したい", scores: { certification: 5 } },
    ],
  },
  {
    id: "experience",
    title: "現在の経験に最も近いものはどれですか？",
    options: [
      { label: "まだ学習を始めていない", scores: { school: 4, certification: 2 } },
      { label: "教材や動画で学習を始めている", scores: { school: 2, certification: 2, career: 1 } },
      { label: "ポートフォリオや個人開発の経験がある", scores: { career: 4, "side-business": 2 } },
      { label: "仕事や案件で制作した経験がある", scores: { "side-business": 4, career: 2 } },
    ],
  },
  {
    id: "time",
    title: "1週間に確保できる学習・活動時間は？",
    options: [
      { label: "3時間未満", scores: { certification: 3, school: 1 } },
      { label: "3〜7時間", scores: { certification: 2, school: 2, career: 1 } },
      { label: "8〜15時間", scores: { career: 3, school: 2, "side-business": 1 } },
      { label: "16時間以上", scores: { "side-business": 3, career: 2, school: 1 } },
    ],
  },
  {
    id: "support",
    title: "今、最も必要な支援は何ですか？",
    options: [
      { label: "経歴整理・応募準備・ポートフォリオ改善", scores: { career: 5 } },
      { label: "実績の見せ方・見積もり・案件獲得準備", scores: { "side-business": 5 } },
      { label: "自分に合う教材・学習環境・スクール比較", scores: { school: 5 } },
      { label: "資格選び・試験対策・学習計画", scores: { certification: 5 } },
    ],
  },
]

const routeResults: Record<RouteId, {
  title: string
  summary: string
  actions: string[]
  anchor: string
  service: string
}> = {
  career: {
    title: "IT転職準備ルート",
    summary: "経験と制作物を整理し、応募先が求めるスキルとの差を埋める進め方が向いています。",
    actions: ["経歴とスキルを棚卸しする", "ポートフォリオの説明を整える", "求人要件から次の学習を決める"],
    anchor: "career-option-career",
    service: "IT転職・ポートフォリオ相談",
  },
  "side-business": {
    title: "副業・フリーランス準備ルート",
    summary: "提供できる作業を小さく定義し、実績・見積もり・問い合わせ導線を整える進め方が向いています。",
    actions: ["提供できる作業を言語化する", "実績ページと料金の考え方を整える", "小さな案件から応募・提案する"],
    anchor: "career-option-side-business",
    service: "副業・フリーランス準備相談",
  },
  school: {
    title: "スクール・体系学習ルート",
    summary: "独学で迷いやすい部分を明確にし、費用と支援内容を比較して学習環境を選ぶ進め方が向いています。",
    actions: ["学習目的と期限を決める", "総費用・質問対応・教材を比較する", "無料相談で支援範囲を確認する"],
    anchor: "career-option-school",
    service: "プログラミングスクール選び相談",
  },
  certification: {
    title: "IT資格・学習計画ルート",
    summary: "目標の仕事に必要な知識を確認し、資格学習を実務や転職準備へつなげる進め方が向いています。",
    actions: ["目標職種に役立つ資格を選ぶ", "試験日から学習計画を逆算する", "学んだ内容を制作や業務で試す"],
    anchor: "career-option-certification",
    service: "IT資格・学習計画相談",
  },
}

const routeOrder: RouteId[] = ["career", "side-business", "school", "certification"]

export default function CareerAiDiagnosis() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [resultId, setResultId] = useState<RouteId | null>(null)
  const [error, setError] = useState("")
  const resultRef = useRef<HTMLDivElement>(null)

  const runDiagnosis = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("4つの質問すべてに回答してください。")
      setResultId(null)
      return
    }

    const scores = Object.fromEntries(routeOrder.map((id) => [id, 0])) as Record<RouteId, number>
    for (const question of questions) {
      const selected = question.options[answers[question.id]]
      for (const [id, score] of Object.entries(selected.scores)) {
        scores[id as RouteId] += score ?? 0
      }
    }

    const bestRoute = routeOrder.reduce((best, current) =>
      scores[current] > scores[best] ? current : best
    )
    setError("")
    setResultId(bestRoute)
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 0)
  }

  const result = resultId ? routeResults[resultId] : null

  return (
    <section className="business-section career-diagnosis" aria-labelledby="career-diagnosis-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span />AIキャリア・収入導線診断</p>
          <h2 id="career-diagnosis-title">4つの質問で、次の一歩を整理する</h2>
        </div>
        <p>回答内容から、転職・副業・フリーランス・スクール・資格の中で優先したいルートを提案します。</p>
      </div>

      <div className="diagnosis-privacy">
        <strong>登録不要・約1分</strong>
        <span>回答はブラウザ内だけで判定し、サーバーへ送信しません。</span>
      </div>

      <div className="diagnosis-questions">
        {questions.map((question, questionIndex) => (
          <fieldset key={question.id}>
            <legend><span>0{questionIndex + 1}</span>{question.title}</legend>
            <div>
              {question.options.map((option, optionIndex) => (
                <label key={option.label}>
                  <input
                    type="radio"
                    name={question.id}
                    value={optionIndex}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="diagnosis-error" role="alert">{error}</p>}
      <button className="diagnosis-submit" type="button" onClick={runDiagnosis}>
        AI診断結果を見る
      </button>

      <div ref={resultRef} className={`diagnosis-result${result ? " is-visible" : ""}`} aria-live="polite">
        {result && resultId && (
          <>
            <p>あなたへのおすすめ</p>
            <h3>{result.title}</h3>
            <p>{result.summary}</p>
            <strong>最初に取り組む3項目</strong>
            <ol>
              {result.actions.map((action) => <li key={action}>{action}</li>)}
            </ol>
            <div className="diagnosis-actions">
              <Link href={`#${result.anchor}`}>おすすめルートの詳細を見る</Link>
              <Link href={`/estimate?service=${encodeURIComponent(result.service)}`}>
                診断結果をもとに相談・見積依頼する
              </Link>
            </div>
            <small>診断は選択内容を整理する目安であり、転職・資格合格・収入を保証するものではありません。</small>
          </>
        )}
      </div>
    </section>
  )
}
