import Link from 'next/link'

import { CONTACT_EMAIL } from '@/lib/config'

import type { PrivacyCopy } from '.'

export const privacyZhHans: PrivacyCopy = {
  seo: {
    title: '隐私政策 — Shenzhen Buddies',
    description: 'Shenzhen Buddies 如何处理你的数据。',
  },
  badge: <>我们不出售你的数据。</>,
  title: <>隐私政策</>,
  lead: (
    <>
      我们收集什么、为什么收集、谁能看到，以及你可以怎么做。不玩套路，不说法律黑话。
    </>
  ),
  lastUpdated: <>最后更新：2026年10月</>,
  onThisPage: <>本页目录</>,
  pilotNotice: (
    <>
      <strong>试运营说明。</strong>Shenzhen Buddies
      目前处于试运营阶段。本页介绍的是我们打算采用的做法，会随着产品逐步成熟而调整。本页用通俗的语言写成，不能代替法律意见。
    </>
  ),
  sections: {
    who: {
      title: '我们是谁',
      body: (
        <p>
          Shenzhen Buddies 由 <strong>Tensai Tech Inc.</strong>{' '}
          运营。这是一家总部位于加拿大多伦多的公司，在中国深圳有合作团队。对于你提供给我们的个人信息，我们是数据控制者。
        </p>
      ),
    },
    collect: {
      title: '我们收集哪些信息',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>账号信息</strong>——电子邮箱，以及经过加盐哈希处理的密码（由
            Supabase Auth 代我们管理）。
          </li>
          <li>
            <strong>你填写的个人资料</strong>
            ——显示名称、身份（旅行者或向导）、城市、个人简介、爱好、语言、性格特点，以及可选的照片。
          </li>
          <li>
            <strong>消息</strong>——你与其他用户之间对话的内容。
          </li>
          <li>
            <strong>评价</strong>——互发消息后留下的星级和文字反馈。
          </li>
          <li>
            <strong>预约</strong>
            ——你预约的日期和时间、你添加的备注、支付金额、币种，以及 Stripe
            结账和付款的编号与状态。银行卡号只保存在 Stripe。
          </li>
          <li>
            <strong>同意与审计记录</strong>——你预约时，我们会记录你已同意我们的
            <Link href="/terms" className="underline">服务条款</Link>和
            <Link href="/cancellation" className="underline">
              取消政策
            </Link>
            ，以及政策版本、你的 <strong>IP 地址</strong>和
            <strong>浏览器标识（用户代理）</strong>，作为你同意的证明。
          </li>
          <li>
            <strong>基本技术数据</strong>——浏览器类型、根据 IP
            推断的大致地区、标准服务器日志。
          </li>
        </ul>
      ),
    },
    use: {
      title: '我们如何使用这些信息',
      body: (
        <>
          <ul className="ml-5 list-disc space-y-2">
            <li>为你匹配兴趣相投的伙伴。</li>
            <li>让你可以给其他用户发消息、评价他们，也接受他们的评价。</li>
            <li>接受预约，并通过 Stripe 处理付款和退款。</li>
            <li>
              保留你已同意我们服务条款和取消政策的审计记录（这是预约合同的法律依据之一）。
            </li>
            <li>调查安全举报，保护用户免受滥用或欺诈。</li>
          </ul>
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            我们<strong>不会</strong>
            出售你的个人信息，不会针对你的个人资料投放第三方广告，也不会与数据经纪商共享。
          </p>
        </>
      ),
    },
    visibility: {
      title: '谁能看到你的个人资料',
      body: (
        <>
          <p>
            默认情况下，你的身份、名字、照片、简介、爱好、语言和性格特点对已登录的用户可见。在{' '}
            <Link href="/profile" className="underline">/profile</Link>{' '}
            把个人资料切换为<strong>私密</strong>
            后，就只有你自己能看到。你的电子邮箱永远不会展示给其他用户。
          </p>
          <p>
            你收到的评价满三条后，会显示在你的公开资料上。在此之前，只有你自己能看到。
          </p>
        </>
      ),
    },
    'third-parties': {
      title: '第三方',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Supabase</strong>——Postgres
            数据库、身份验证、文件存储。（
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              隐私政策
            </a>
            ）
          </li>
          <li>
            <strong>Vercel</strong>——应用托管和边缘分发。
          </li>
          <li>
            <strong>Stripe</strong>——预约付款和退款。所有支付卡数据都由 Stripe
            处理。（
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              隐私政策
            </a>
            ）
          </li>
        </ul>
      ),
    },
    rights: {
      title: '你的权利',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>访问</strong>——可以在应用内查看，也可以发邮件给我们，索取完整的数据导出。
          </li>
          <li>
            <strong>更正</strong>——随时在{' '}
            <Link href="/profile" className="underline">/profile</Link>{' '}
            更新。
          </li>
          <li>
            <strong>删除</strong>
            ——发邮件给我们，即可删除你的账号，以及你的个人资料、消息和评价。如果我们有义务保留（例如出于税务、会计和防范欺诈方面的要求），我们可能会保留有限的预约、付款及同意/审计记录，不再需要时再删除。
          </li>
        </ul>
      ),
    },
    cookies: {
      title: 'Cookie',
      body: (
        <p>
          我们只使用两类 Cookie：一类是你的登录会话，由 Supabase Auth
          设置，让你保持登录状态；另一类是语言偏好，会记住你选择的语言，保存一年。语言
          Cookie
          只记录你选的语言，不含任何个人信息。试运营期间，不使用任何分析或广告 Cookie。
        </p>
      ),
    },
    contact: {
      title: '联系我们',
      body: (
        <p>
          如有隐私方面的问题，或想行使上述任何权利，请发邮件至{' '}
          <strong>{CONTACT_EMAIL}</strong>。我们会尽量在七天内回复。
        </p>
      ),
    },
  },
  reachOut: <>给我们留言</>,
  aboutUs: <>关于我们</>,
}
