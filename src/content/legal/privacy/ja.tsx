import Link from 'next/link'

import { CONTACT_EMAIL } from '@/lib/config'

import type { PrivacyCopy } from '.'

// Japanese sets Latin words flush against kana with no spaces, matching the
// site dictionary. Each paragraph's text is kept on one source line so JSX
// does not insert a space at the line breaks.
export const privacyJa: PrivacyCopy = {
  seo: {
    title: 'プライバシーポリシー｜Shenzhen Buddies',
    description: 'Shenzhen Buddiesでの個人データの取り扱いについて。',
  },
  badge: <>あなたのデータを売ることはありません。</>,
  title: <>プライバシーポリシー</>,
  lead: (
    <>
      何を集め、なぜ集め、誰が見られるのか。そして、あなたに何ができるのか。わかりにくい仕掛けも、難しい法律用語もありません。
    </>
  ),
  lastUpdated: <>最終更新：2026年10月</>,
  onThisPage: <>このページの内容</>,
  pilotNotice: (
    <>
      <strong>パイロット期間中のお知らせ：</strong>Shenzhen Buddiesは現在パイロット運営中です。このページは当社が予定している取り扱いを説明したもので、サービスの成熟にあわせて内容が変わることがあります。平易な言葉で書いており、法的助言に代わるものではありません。
    </>
  ),
  sections: {
    who: {
      title: '運営者について',
      body: (
        <p>
          Shenzhen Buddiesは、カナダ・トロントを拠点とし、中国・深圳にパートナーチームを持つ<strong>Tensai Tech Inc.</strong>が運営しています。あなたからお預かりする個人情報について、当社がデータ管理者となります。
        </p>
      ),
    },
    collect: {
      title: '収集する情報',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>アカウント情報</strong>：メールアドレスと、ソルト付きでハッシュ化したパスワード（当社に代わってSupabase Authが管理します）。
          </li>
          <li>
            <strong>あなたが入力するプロフィール情報</strong>：表示名、立場（旅行者またはガイド）、都市、自己紹介、趣味、話せる言語、性格、任意の写真。
          </li>
          <li>
            <strong>メッセージ</strong>：あなたがほかのユーザーと交わした会話の内容。
          </li>
          <li>
            <strong>レビュー</strong>：メッセージをやり取りしたあとに付ける星の数と感想。
          </li>
          <li>
            <strong>予約</strong>：予約した日時、書き添えたメモ、支払額、通貨、Stripeのチェックアウトと支払いのIDおよびステータス。カード番号はStripeが保管し、当社には届きません。
          </li>
          <li>
            <strong>同意と監査の記録</strong>：予約の際、あなたが当社の
            <Link href="/terms" className="underline">利用規約</Link>と
            <Link href="/cancellation" className="underline">
              キャンセルポリシー
            </Link>
            に同意したこと、ポリシーのバージョン、あなたの<strong>IPアドレス</strong>と<strong>ブラウザ情報（ユーザーエージェント）</strong>を、同意の証拠として記録します。
          </li>
          <li>
            <strong>基本的な技術データ</strong>：ブラウザの種類、IPから推定されるおおよその地域、標準的なサーバーログ。
          </li>
        </ul>
      ),
    },
    use: {
      title: '情報の使い道',
      body: (
        <>
          <ul className="ml-5 list-disc space-y-2">
            <li>趣味の合いそうなバディとあなたをマッチングするため。</li>
            <li>ほかのユーザーとのメッセージのやり取りや、レビューを書いたり受けたりできるようにするため。</li>
            <li>予約を受け付け、Stripeを通じて支払いと返金を処理するため。</li>
            <li>あなたが利用規約とキャンセルポリシーに同意したことの監査記録を残すため（予約契約の法的根拠となります）。</li>
            <li>安全に関する報告を調査し、悪用や詐欺からユーザーを守るため。</li>
          </ul>
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            当社は、あなたの個人情報を販売することも、あなたのプロフィールに基づいて第三者の広告を配信することも、データブローカーと共有することも<strong>ありません</strong>。
          </p>
        </>
      ),
    },
    visibility: {
      title: 'プロフィールを見られる人',
      body: (
        <>
          <p>
            初期設定では、立場、名前、写真、自己紹介、趣味、言語、性格は、ログインしているユーザーに表示されます。
            <Link href="/profile" className="underline">/profile</Link>
            でプロフィールを<strong>非公開</strong>に切り替えると、あなただけが見られるようになります。メールアドレスがほかのユーザーに表示されることはありません。
          </p>
          <p>
            あなたが受け取ったレビューは、3件以上たまると公開プロフィールに表示されます。それまでは、あなただけが見られます。
          </p>
        </>
      ),
    },
    'third-parties': {
      title: '外部サービス',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Supabase</strong>：Postgresデータベース、認証、ファイル保存。（
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              プライバシーポリシー
            </a>
            ）
          </li>
          <li>
            <strong>Vercel</strong>：アプリのホスティングとエッジ配信。
          </li>
          <li>
            <strong>Stripe</strong>：予約の支払いと返金。カード情報はすべてStripeが取り扱います。（
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              プライバシーポリシー
            </a>
            ）
          </li>
        </ul>
      ),
    },
    rights: {
      title: 'あなたの権利',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>開示</strong>：アプリ内で確認できるほか、メールでご依頼いただければ全データをエクスポートしてお渡しします。
          </li>
          <li>
            <strong>訂正</strong>：
            <Link href="/profile" className="underline">/profile</Link>
            からいつでも更新できます。
          </li>
          <li>
            <strong>削除</strong>：メールでご依頼いただければ、アカウントと、プロフィール、メッセージ、レビューを削除します。ただし、税務、会計、不正防止などの義務で保管が求められる場合は、予約、支払い、同意・監査の記録の一部を保持することがあります。その場合も、不要になった時点で削除します。
          </li>
        </ul>
      ),
    },
    cookies: {
      title: 'クッキー',
      body: (
        <p>
          使用するクッキーは2種類です。1つは、ログイン状態を保つためにSupabase Authが設定する認証セッション用のクッキー。もう1つは、選んだ言語を1年間覚えておくための言語設定用のクッキーで、記録するのは選んだ言語だけです。個人情報は含みません。パイロット期間中は、分析や広告のためのクッキーは使用しません。
        </p>
      ),
    },
    contact: {
      title: 'お問い合わせ',
      body: (
        <p>
          プライバシーに関するご質問や、上記の権利を行使したい場合は、<strong>{CONTACT_EMAIL}</strong>までメールでご連絡ください。7日以内の返信を目指しています。
        </p>
      ),
    },
  },
  reachOut: <>お問い合わせはこちら</>,
  aboutUs: <>私たちについて</>,
}
