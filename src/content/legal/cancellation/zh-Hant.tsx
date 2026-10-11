import Link from 'next/link'

import { MailLink, accentLinkClass, linkClass } from '../shared'
import type { CancellationCopy } from '.'

export const cancellationZhHant: CancellationCopy = {
  seo: {
    title: '取消及退款政策 — Shenzhen Buddies',
    description:
      'Shenzhen Buddies 嚮導預約的取消及退款安排：確認前取消可獲全數退款，確認後按 72 小時／24 小時分級退款，清楚明確。',
  },
  title: <>取消及退款政策</>,
  effective: (date) => <>生效日期：{date}</>,
  lead: (
    <>
      計劃總會有變。取消嚮導預約後可以取回多少，我們在這裏以淺白文字說清楚。
    </>
  ),
  table: { when: <>取消時間</>, refund: <>退款</> },
  rows: {
    beforeConfirm: {
      when: '我們確認預約之前',
      refund: '100%——全數退款',
    },
    over72: {
      when: '行程開始前 72 小時或以上',
      refund: '100%——全數退款',
    },
    between: {
      when: '開始前 72 至 24 小時之間',
      refund: '90%（取消手續費 10%）',
    },
    under24: {
      when: '開始前不足 24 小時',
      refund: '20%（取消手續費 80%）',
    },
    declined: {
      when: '我們未能確認／婉拒預約',
      refund: '100%——全數退款',
    },
  },
  sections: [
    {
      title: '1. 預約確認之前',
      body: (
        <p>
          你預約並付款後，我們會為你預留這一天；在我們的團隊（或你的嚮導）審核申請期間，款項會暫時保留。在預約
          <strong>確認</strong>之前，你可隨時取消，並獲
          <strong>全數退款</strong>。
        </p>
      ),
    },
    {
      title: '2. 預約確認之後',
      body: (
        <>
          <p>
            預約確認後，以下分級安排適用，時間由
            <strong>行程的預定開始時間</strong>（深圳時間，UTC+8）起計：
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>開始前 72 小時或以上：</strong>全數退款（100%）。
            </li>
            <li>
              <strong>開始前 72 至 24 小時之間：</strong>退款 90%，並收取 10%
              取消手續費。
            </li>
            <li>
              <strong>開始前不足 24 小時：</strong>退款 20%，並收取 80%
              取消手續費。
            </li>
          </ul>
          <p>
            在你確認取消之前，取消按鈕上會顯示確實的退款金額，讓你清楚知道可以取回多少。
          </p>
        </>
      ),
    },
    {
      title: '3. 如我們未能確認你的預約',
      body: (
        <p>
          如我們或你的嚮導未能確認你申請的日子，預約會被婉拒，你會自動獲得
          <strong>全數退款</strong>，毋須採取任何行動。
        </p>
      ),
    },
    {
      title: '4. 未有到場',
      body: (
        <p>
          如你沒有預先取消，亦沒有在約定的時間及地點到場，該預約將當作
          <strong>開始前不足 24 小時</strong>取消處理（
          <strong>退款 20%</strong>）。
        </p>
      ),
    },
    {
      title: '5. 退款方式',
      body: (
        <p>
          退款會經我們的付款服務商 Stripe
          退回你原本的付款方式。視乎你的銀行或發卡機構，退款一般需時{' '}
          <strong>5–10 個工作天</strong>
          才會在你的結單上顯示。退款金額按你實際支付的金額（扣除優惠碼折扣後）計算。
        </p>
      ),
    },
    {
      title: '6. 如何取消',
      body: (
        <p>
          登入後前往
          <Link href="/guide" className={accentLinkClass}>
            預約頁面
          </Link>
          ，在「我的預約」下找到該預約，然後選擇<strong>取消</strong>
          。在你確認之前，按鈕上會顯示根據本政策適用的退款金額。
        </p>
      ),
    },
    {
      title: '7. 更改日期',
      body: (
        <p>
          目前未能在應用程式內更改已確認預約的日期或時間。如需改期，請先取消預約（按本政策處理），再預約新的日子，或電郵至{' '}
          <MailLink />
          ，我們會盡力協助。
        </p>
      ),
    },
    {
      title: '8. 貨幣及價格',
      body: (
        <p>
          免費試營運期間，行程不設收費——取消只會騰出該時段，沒有任何款項需要退回。行程收費時：所有預約及退款均以加拿大元（CAD）處理，行程按結賬時顯示的劃一每小時收費計算；你的發卡機構或會收取其本身的貨幣兌換費用或其他費用，這並非我們所能控制。
        </p>
      ),
    },
    {
      title: '9. 查詢',
      body: (
        <p>
          如你覺得取消或退款有任何不妥，請電郵至 <MailLink />
          ，我們會跟進。
        </p>
      ),
    },
  ],
  footer: (
    <>
      本取消及退款政策構成我們
      <Link href="/terms" className={linkClass}>
        服務條款
      </Link>
      的一部分，並應與之一併閱讀。由 Tensai Tech Inc. 營運。
    </>
  ),
}
