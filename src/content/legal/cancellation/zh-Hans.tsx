import Link from 'next/link'

import { MailLink, accentLinkClass, linkClass } from '../shared'
import type { CancellationCopy } from '.'

export const cancellationZhHans: CancellationCopy = {
  seo: {
    title: '取消与退款政策 — Shenzhen Buddies',
    description:
      'Shenzhen Buddies 向导预约的取消和退款规则：确认前取消可全额退款，确认后按 72 小时 / 24 小时分档退款，清清楚楚。',
  },
  title: <>取消与退款政策</>,
  effective: (date) => <>生效日期：{date}</>,
  lead: (
    <>
      计划总有变化。取消向导预约后能拿回多少钱，这里用大白话给你讲清楚。
    </>
  ),
  table: { when: <>取消时间</>, refund: <>退款</> },
  rows: {
    beforeConfirm: {
      when: '我们确认预约之前',
      refund: '100%——全额退款',
    },
    over72: {
      when: '行程开始前 72 小时或以上',
      refund: '100%——全额退款',
    },
    between: {
      when: '开始前 72 至 24 小时之间',
      refund: '90%（取消手续费 10%）',
    },
    under24: {
      when: '开始前不到 24 小时',
      refund: '20%（取消手续费 80%）',
    },
    declined: {
      when: '我们无法确认／婉拒预约',
      refund: '100%——全额退款',
    },
  },
  sections: [
    {
      title: '1. 预约确认之前',
      body: (
        <p>
          你预约并付款后，这一天就为你留出来了；我们的团队（或你的向导）审核申请期间，这笔付款会先由我们暂时保留。在预约
          <strong>确认</strong>之前，你可以随时取消，并获得
          <strong>全额退款</strong>。
        </p>
      ),
    },
    {
      title: '2. 预约确认之后',
      body: (
        <>
          <p>
            预约确认后，适用以下分档规则，时间从
            <strong>行程的预定开始时间</strong>（深圳时间，UTC+8）起算：
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>开始前 72 小时或以上：</strong>全额退款（100%）。
            </li>
            <li>
              <strong>开始前 72 至 24 小时之间：</strong>退款 90%，收取 10%
              的取消手续费。
            </li>
            <li>
              <strong>开始前不到 24 小时：</strong>退款 20%，收取 80%
              的取消手续费。
            </li>
          </ul>
          <p>
            在你确认取消之前，取消按钮上会显示具体的退款金额，让你始终清楚能拿回多少。
          </p>
        </>
      ),
    },
    {
      title: '3. 如果我们无法确认你的预约',
      body: (
        <p>
          如果我们或你的向导无法确认你申请的日期，预约会被婉拒，你会自动获得
          <strong>全额退款</strong>，无需任何操作。
        </p>
      ),
    },
    {
      title: '4. 未到场',
      body: (
        <p>
          如果你没有提前取消，也没有在约定的时间和地点到场，该预约将按
          <strong>开始前不到 24 小时</strong>取消处理（
          <strong>退款 20%</strong>）。
        </p>
      ),
    },
    {
      title: '5. 退款方式',
      body: (
        <p>
          退款会通过我们的支付服务商 Stripe
          原路退回到你的付款方式。视你的银行或发卡机构而定，退款通常需要{' '}
          <strong>5–10 个工作日</strong>
          才会出现在你的账单上。退款金额按你实际支付的金额（使用优惠码之后）计算。
        </p>
      ),
    },
    {
      title: '6. 如何取消',
      body: (
        <p>
          登录后打开
          <Link href="/guide" className={accentLinkClass}>
            预约页面
          </Link>
          ，在“我的预约”下找到这笔预约，然后点击<strong>取消</strong>
          。在你确认之前，按钮上会显示按本政策适用的退款金额。
        </p>
      ),
    },
    {
      title: '7. 改期',
      body: (
        <p>
          目前还不支持在应用内更改已确认预约的日期或时间。如需改期，请先取消预约（按本政策处理）再预约新的日期，或者发邮件至{' '}
          <MailLink />
          ，我们会尽力帮忙。
        </p>
      ),
    },
    {
      title: '8. 币种与价格',
      body: (
        <p>
          免费试运营期间，行程不收费——取消只是把时段空出来，没有需要退的款项。行程收费时：所有预约和退款均以加拿大元（CAD）处理，行程按结账时显示的固定小时费率计价；你的发卡机构可能会收取其自身的货币兑换费或其他费用，这不在我们的控制范围内。
        </p>
      ),
    },
    {
      title: '9. 有疑问？',
      body: (
        <p>
          如果你觉得取消或退款有任何不对的地方，请发邮件至 <MailLink />
          ，我们会帮你查清楚。
        </p>
      ),
    },
  ],
  footer: (
    <>
      本取消与退款政策是我们
      <Link href="/terms" className={linkClass}>
        服务条款
      </Link>
      的一部分，应与之一并阅读。由 Tensai Tech Inc. 运营。
    </>
  ),
}
