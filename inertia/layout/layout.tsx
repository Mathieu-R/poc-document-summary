import { PropsWithChildren } from 'react'

import { Theme } from '@radix-ui/themes'
import Header from '~/layout/header'

type LayoutProps = PropsWithChildren<{
  user: any
}>

export default function Layout({ user, children }: LayoutProps) {
  return (
    <Theme>
      <div className="grid grid-rows-[70px_1fr]">
        <Header user={user} />
        <div className="flex-1">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </Theme>
  )
}
