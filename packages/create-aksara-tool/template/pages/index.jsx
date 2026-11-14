import Head from 'next/head'
import { useEffect, useState } from 'react'
import {
  SiteHeader, HeaderTool, SiteFooter, Page,
  Workbench, BenchPane, BenchSeam, BenchInput, BenchOutput, BenchTools, BenchChip,
  BenchActions, BenchAction, BenchFlip, AksaraKeyboard,
} from '@aksara-bali/react'
import { script } from '../script.config'

const Icon = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>
)
const SUN = 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
const MOON = 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'

const copy = {
  id: {
    title: `Konverter ${script.name}`,
    lede: 'Ketik huruf Latin, hasil aksara muncul langsung. Salin atau balik arahnya.',
    latin: 'Latin', scriptLabel: script.name,
    placeholder: `Ketik di sini, misalnya "${script.sample}"`,
    empty: 'Hasil aksara muncul di sini saat Anda mengetik.',
    emptyLatin: 'Hasil Latin muncul di sini.',
    flipToLatin: 'Aksara ke Latin', flipToScript: 'Latin ke aksara',
    copy: 'Salin', copied: 'Tersalin', clear: 'Hapus', keyboard: 'Papan ketik',
    space: 'Spasi', backspace: 'Hapus huruf', theme: 'Ganti tema',
    note: 'Periksa hasil bersama guru atau penutur asli sebelum dipakai untuk keperluan resmi.',
  },
  en: {
    title: `${script.name} Converter`,
    lede: 'Type Latin letters and the script appears as you go. Copy it, or flip the direction.',
    latin: 'Latin', scriptLabel: script.name,
    placeholder: `Type here, e.g. "${script.sample}"`,
    empty: 'The script appears here as you type.',
    emptyLatin: 'The Latin reading appears here.',
    flipToLatin: 'Script to Latin', flipToScript: 'Latin to script',
    copy: 'Copy', copied: 'Copied', clear: 'Clear', keyboard: 'Keyboard',
    space: 'Space', backspace: 'Delete', theme: 'Switch theme',
    note: 'Check the result with a teacher or native speaker before official use.',
  },
}

export default function Home() {
  const [locale, setLocale] = useState('id')
  const [dark, setDark] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const t = copy[locale]

  useEffect(() => {
    try { setDark(localStorage.getItem('theme') === 'dark') } catch {}
  }, [])
  useEffect(() => {
    if (dark) document.documentElement.setAttribute('data-bs-theme', 'dark')
    else document.documentElement.removeAttribute('data-bs-theme')
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  const output = reverse ? script.toLatin(text) : script.toScript(text)

  const flip = () => { setText(output.replace(/​/g, ' ')); setReverse(r => !r) }
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
  }

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.lede} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SiteHeader
        mark={script.mark}
        name={script.name}
        links={[{ href: '/', label: locale === 'id' ? 'Konverter' : 'Converter' }]}
        active="/"
        tools={<>
          <HeaderTool onClick={() => setLocale(locale === 'id' ? 'en' : 'id')} aria-label="Language">
            {locale === 'id' ? 'EN' : 'ID'}
          </HeaderTool>
          <HeaderTool onClick={() => setDark(d => !d)} aria-label={t.theme}><Icon d={dark ? SUN : MOON} /></HeaderTool>
        </>}
      />

      <main>
        <Page title={t.title} lede={t.lede}>
          <Workbench pulled={!!output} key={reverse ? 'rev' : 'fwd'}>
            <BenchPane label={reverse ? t.scriptLabel : t.latin} labelFor="input">
              <BenchInput
                id="input"
                script={reverse}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={reverse ? '' : t.placeholder}
                rows={6}
              />
              <BenchTools>
                {script.keyboard && (
                  <BenchChip aria-expanded={showKeys} onClick={() => setShowKeys(v => !v)}>{t.keyboard}</BenchChip>
                )}
                <BenchChip push onClick={() => setText('')} disabled={!text}>{t.clear}</BenchChip>
              </BenchTools>
            </BenchPane>
            <BenchSeam />
            <BenchPane
              script
              label={reverse ? t.latin : t.scriptLabel}
              aside={<BenchFlip onClick={flip}>{reverse ? t.flipToScript : t.flipToLatin}</BenchFlip>}
            >
              <BenchOutput value={output} latin={reverse} lang={script.lang} placeholder={reverse ? t.emptyLatin : t.empty} />
              <BenchActions>
                <BenchAction primary onClick={doCopy} disabled={!output}>{copied ? t.copied : t.copy}</BenchAction>
              </BenchActions>
            </BenchPane>
          </Workbench>

          {showKeys && script.keyboard && (
            <div className="panel">
              <div className="panel__body">
                <AksaraKeyboard
                  layout={script.keyboard}
                  locale={locale}
                  lang={script.lang}
                  labels={{ space: t.space, backspace: t.backspace }}
                  onKey={ch => { if (!reverse) { setReverse(true); setText(ch) } else setText(v => v + ch) }}
                  onSpace={() => setText(v => v + ' ')}
                  onBackspace={() => setText(v => Array.from(v).slice(0, -1).join(''))}
                />
              </div>
            </div>
          )}

          <p className="bench-note" style={{ marginTop: 16 }}>{t.note}</p>
        </Page>
      </main>

      <SiteFooter>
        <small>{script.name} · built with @aksara-bali</small>
      </SiteFooter>
    </>
  )
}
