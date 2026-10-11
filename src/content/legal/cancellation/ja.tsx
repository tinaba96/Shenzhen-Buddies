import Link from 'next/link'

import { MailLink, accentLinkClass, linkClass } from '../shared'
import type { CancellationCopy } from '.'

// Japanese sets Latin words and numbers flush against kana with no spaces,
// matching the site dictionary. Each paragraph's text is kept on one source
// line so JSX does not insert a space at the line breaks.
export const cancellationJa: CancellationCopy = {
  seo: {
    title: 'キャンセル・返金ポリシー｜Shenzhen Buddies',
    description:
      'Shenzhen Buddiesのガイド予約のキャンセルと返金について。確定前なら全額返金、確定後は72時間前・24時間前を区切りとするわかりやすい段階制です。',
  },
  title: <>キャンセル・返金ポリシー</>,
  effective: (date) => <>施行日：{date}</>,
  lead: (
    <>
      予定は変わるものです。ガイドの予約をキャンセルしたときにいくら戻ってくるのか、わかりやすい言葉でまとめました。
    </>
  ),
  table: { when: <>キャンセルのタイミング</>, refund: <>返金</> },
  rows: {
    beforeConfirm: {
      when: '当社が予約を確定する前',
      refund: '100%（全額返金）',
    },
    over72: {
      when: 'ツアーの72時間以上前',
      refund: '100%（全額返金）',
    },
    between: {
      when: '72〜24時間前',
      refund: '90%（キャンセル料10%）',
    },
    under24: {
      when: '24時間を切ってから',
      refund: '20%（キャンセル料80%）',
    },
    declined: {
      when: '当社が確定できない／お断りする場合',
      refund: '100%（全額返金）',
    },
  },
  sections: [
    {
      title: '1. 予約が確定する前',
      body: (
        <p>
          予約してお支払いいただくと、その日を押さえたうえで、当社のチーム（またはガイド）がリクエストを確認します。そのあいだ、お支払いはお預かりしておきます。予約が<strong>確定</strong>するまでは、いつキャンセルしても<strong>全額返金</strong>です。
        </p>
      ),
    },
    {
      title: '2. 予約が確定した後',
      body: (
        <>
          <p>
            確定後は、<strong>ツアーの開始予定時刻</strong>（深圳時間、UTC+8）を基準に、次の段階制が適用されます。
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>開始時刻の72時間以上前：</strong>全額返金（100%）。
            </li>
            <li>
              <strong>72〜24時間前：</strong>90%返金。キャンセル料として10%がかかります。
            </li>
            <li>
              <strong>24時間を切ってから：</strong>20%返金。キャンセル料として80%がかかります。
            </li>
          </ul>
          <p>
            正確な返金額はキャンセルボタンに表示されます。キャンセルを確定する前に、いくら戻ってくるのかを必ず確認できます。
          </p>
        </>
      ),
    },
    {
      title: '3. 当社が予約を確定できない場合',
      body: (
        <p>
          当社またはガイドがご希望の日程を確定できない場合、予約はお断りとなり、自動的に<strong>全額返金</strong>されます。お手続きは必要ありません。
        </p>
      ),
    },
    {
      title: '4. 無断不参加（ノーショー）',
      body: (
        <p>
          事前にキャンセルせず、約束の時間と場所にお越しにならなかった場合は、ツアーの<strong>24時間を切ってから</strong>のキャンセルとして扱います（<strong>20%返金</strong>）。
        </p>
      ),
    },
    {
      title: '5. 返金の方法',
      body: (
        <p>
          返金は、当社の決済代行会社であるStripeを通じて、お支払いに使われた方法に戻されます。銀行やカード発行会社によって異なりますが、明細に反映されるまで通常<strong>5〜10営業日</strong>ほどかかります。返金額は、実際にお支払いいただいた金額（プロモーションコード適用後）をもとに計算します。
        </p>
      ),
    },
    {
      title: '6. キャンセルの方法',
      body: (
        <p>
          ログインして
          <Link href="/guide" className={accentLinkClass}>
            予約一覧
          </Link>
          を開き、「予約リクエスト」の中から該当の予約を探して<strong>キャンセル</strong>を選んでください。このポリシーに基づく返金額は、キャンセルを確定する前にボタンに表示されます。
        </p>
      ),
    },
    {
      title: '7. 日程の変更',
      body: (
        <p>
          現在、確定済みの予約の日付や時間をアプリ内で変更することはできません。日程を変えたい場合は、予約をキャンセル（このポリシーが適用されます）して新しい日を予約し直すか、
          <MailLink />
          までメールでご連絡ください。できる限りお手伝いします。
        </p>
      ),
    },
    {
      title: '8. 通貨と料金',
      body: (
        <p>
          パイロット期間中は、ツアーは無料です。キャンセルしてもその時間枠が空くだけで、返金するものはありません。ツアーが有料の場合は、予約と返金はすべてカナダドル（CAD）で処理され、料金は決済時に表示される一律の時間単価です。また、カード発行会社が独自の通貨換算や手数料を適用する場合がありますが、これは当社の管理外です。
        </p>
      ),
    },
    {
      title: '9. お問い合わせ',
      body: (
        <p>
          キャンセルや返金について何かおかしいと感じたら、
          <MailLink />
          までご連絡ください。こちらで確認して対応します。
        </p>
      ),
    },
  ],
  footer: (
    <>
      このキャンセル・返金ポリシーは、当社の
      <Link href="/terms" className={linkClass}>
        利用規約
      </Link>
      の一部を構成し、あわせてお読みいただくものです。運営：Tensai Tech Inc.
    </>
  ),
}
