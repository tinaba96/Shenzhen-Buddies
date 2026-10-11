import Link from 'next/link'

import { CONTACT_EMAIL } from '@/lib/config'

import type { PrivacyCopy } from '.'

export const privacyZhHant: PrivacyCopy = {
  seo: {
    title: '私隱政策 — Shenzhen Buddies',
    description: 'Shenzhen Buddies 如何處理你的資料。',
  },
  badge: <>我們不會出售你的資料。</>,
  title: <>私隱政策</>,
  lead: (
    <>
      我們收集甚麼、為何收集、誰可以看到，以及你可以怎樣處理。不設陷阱，不講艱澀的法律術語。
    </>
  ),
  lastUpdated: <>最後更新：2026年10月</>,
  onThisPage: <>本頁內容</>,
  pilotNotice: (
    <>
      <strong>試營運須知。</strong>Shenzhen Buddies
      目前處於試營運階段。本頁說明的是我們擬採用的做法，並會隨產品逐步成熟而更新。本頁以淺白文字撰寫，不能取代法律意見。
    </>
  ),
  sections: {
    who: {
      title: '我們是誰',
      body: (
        <p>
          Shenzhen Buddies 由 <strong>Tensai Tech Inc.</strong>{' '}
          營運。這是一家以加拿大多倫多為基地的公司，在中國深圳設有合作團隊。就你提供給我們的個人資料而言，我們是資料控制者。
        </p>
      ),
    },
    collect: {
      title: '我們收集的資料',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>帳號資料</strong>——電郵地址，以及經加鹽雜湊處理的密碼（由
            Supabase Auth 代我們管理）。
          </li>
          <li>
            <strong>你填寫的個人檔案</strong>
            ——顯示名稱、身份（旅客或嚮導）、城市、個人簡介、興趣、語言、性格特質，以及可選的相片。
          </li>
          <li>
            <strong>訊息</strong>——你與其他用戶之間對話的內容。
          </li>
          <li>
            <strong>評價</strong>——互傳訊息後留下的星級及文字回饋。
          </li>
          <li>
            <strong>預約</strong>
            ——你預約的日期和時間、你加入的備註、付款金額、貨幣，以及 Stripe
            結賬和付款的編號及狀態。卡號只會由 Stripe 保存。
          </li>
          <li>
            <strong>同意及審計紀錄</strong>——你預約時，我們會記錄你已同意我們的
            <Link href="/terms" className="underline">服務條款</Link>和
            <Link href="/cancellation" className="underline">
              取消政策
            </Link>
            ，以及政策版本、你的 <strong>IP 地址</strong>和
            <strong>瀏覽器識別資料（用戶代理）</strong>，作為你同意的證明。
          </li>
          <li>
            <strong>基本技術數據</strong>——瀏覽器類型、根據 IP
            推斷的大概地區，以及標準伺服器日誌。
          </li>
        </ul>
      ),
    },
    use: {
      title: '我們如何使用資料',
      body: (
        <>
          <ul className="ml-5 list-disc space-y-2">
            <li>為你配對興趣相投的夥伴。</li>
            <li>讓你可以向其他用戶傳送訊息、評價對方，以及獲對方評價。</li>
            <li>接受預約，並透過 Stripe 處理付款及退款。</li>
            <li>
              保存你已同意我們服務條款及取消政策的審計紀錄（這是預約合約的法律依據之一）。
            </li>
            <li>調查安全舉報，保護用戶免受濫用或欺詐。</li>
          </ul>
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            我們<strong>不會</strong>
            出售你的個人資料，不會針對你的個人檔案投放第三方廣告，亦不會與資料經紀共享你的資料。
          </p>
        </>
      ),
    },
    visibility: {
      title: '誰可以看到你的個人檔案',
      body: (
        <>
          <p>
            在預設情況下，你的身份、名稱、相片、簡介、興趣、語言及性格特質會向已登入的用戶顯示。你可在{' '}
            <Link href="/profile" className="underline">/profile</Link>{' '}
            把個人檔案設為<strong>私人</strong>
            ，之後便只有你自己可以看到。你的電郵地址絕不會向其他用戶顯示。
          </p>
          <p>
            你收到的評價累積滿三則後，便會在你的公開檔案上顯示。在此之前，只有你自己可以看到。
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
            資料庫、身份驗證及檔案儲存。（
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              私隱政策
            </a>
            ）
          </li>
          <li>
            <strong>Vercel</strong>——應用程式寄存及邊緣網絡傳送。
          </li>
          <li>
            <strong>Stripe</strong>——預約付款及退款。所有付款卡資料均由 Stripe
            處理。（
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              私隱政策
            </a>
            ）
          </li>
        </ul>
      ),
    },
    rights: {
      title: '你的權利',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>查閱</strong>——可在應用程式內查看，或電郵給我們索取完整的資料匯出。
          </li>
          <li>
            <strong>更正</strong>——隨時在{' '}
            <Link href="/profile" className="underline">/profile</Link>{' '}
            更新。
          </li>
          <li>
            <strong>刪除</strong>
            ——電郵給我們，即可刪除你的帳號，以及你的個人檔案、訊息及評價。如我們有責任保留某些紀錄（例如稅務、會計及防範欺詐方面的責任），我們或會保留有限的預約、付款及同意／審計紀錄，並在不再需要時刪除。
          </li>
        </ul>
      ),
    },
    cookies: {
      title: 'Cookie',
      body: (
        <p>
          我們只使用兩類 Cookie：一類記錄你的登入狀態，由 Supabase Auth
          設定，讓你不用每次重新登入；另一類是語言偏好，會記住你所選的語言，有效期為一年。語言
          Cookie
          只記錄這項選擇，不含任何個人資料。試營運期間，不會使用任何分析或廣告 Cookie。
        </p>
      ),
    },
    contact: {
      title: '聯絡我們',
      body: (
        <p>
          如對私隱有任何疑問，或想行使上述任何權利，請電郵至{' '}
          <strong>{CONTACT_EMAIL}</strong>。我們會盡量在七天內回覆。
        </p>
      ),
    },
  },
  reachOut: <>給我們留言</>,
  aboutUs: <>關於我們</>,
}
