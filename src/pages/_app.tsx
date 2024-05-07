import KbLayout from '@/layout'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import '@/styles/global.scss'
import { useEffect, useState } from 'react'

import React from 'react'
import { Button, ConfigProvider, theme } from 'antd'
import { Nunito } from '@next/font/google'

const nunito = Nunito({ subsets: ['latin'] })

React.useLayoutEffect = React.useEffect

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = document.getElementById('globalLoader')
      setTimeout(() => {
        if (loader) loader.remove()
      }, 1000)
    }
  }, [])

  const handleChangeMode = () => {
    setIsDarkMode((previousValue) => !previousValue)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: nunito.style.fontFamily,
          // colorBgContainer: isDarkMode ? '#001523' : '#fff',
          // colorBgLayout: isDarkMode ? '#00111c' : '#f1f1f1',
          // colorBgBase: isDarkMode ? '#001a2c' : '#f1f1f1',
        },
      }}
    >
      <NextNProgress
        color="#0E64CB"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      {pageProps.without_layout ? (
        <Component {...pageProps} />
      ) : (
        <KbLayout
          session={session}
          themeMode={isDarkMode}
          onChangeMode={handleChangeMode}
          menuKey={pageProps.menuKey ? pageProps.menuKey : null}
        >
          <Component {...pageProps} />
        </KbLayout>
      )}
    </ConfigProvider>
  )
}
