import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Avatar, Button, Progress } from '@radix-ui/themes'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { InferPageProps } from '@adonisjs/inertia/types'
import HomeController from '#controllers/home_controller'

import { LAGO_URL } from '../../resources/ts/config'

type User = InferPageProps<HomeController, 'index'>

const renderAuthenticatedHeader = (
  user: User['user'],
  usedCredits?: number,
  totalCredits?: number
) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-2 shadow-md">
      <div className="flex items-center gap-10">
        <div className="flex flex-row items-center justify-around gap-2">
          <Avatar src={user!.avatarUrl} radius="full" fallback="Avatar" />
          <div className="font-bold">{user!.fullname}</div>
        </div>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Summary</Link>
          </li>
          <li>
            <Link href="/credits">Buy credits</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        {usedCredits && totalCredits ? (
          <div className="flex flex-row gap-2 items-center justify-center">
            Credits usage: <Progress value={usedCredits / totalCredits} />
          </div>
        ) : (
          ''
        )}
        <a href={`/logout`}>
          <Button className="cursor-pointer">Logout</Button>
        </a>
      </div>
    </div>
  )
}

const renderUnAuthenticatedHeader = () => {
  return (
    <div className="flex items-center justify-end w-full px-6 py-2 shadow-md">
      <a href="/login/github">
        <Button className="cursor-pointer">
          <GitHubLogoIcon />
          Login with GitHub
        </Button>
      </a>
    </div>
  )
}

export default function Header({ user }: User) {
  const [usedCredits, setUsedCredits] = useState(undefined)
  const [totalCredits, setTotalCredits] = useState(undefined)

  useEffect(() => {
    console.log(user)

    if (!user || !user.lagoWalletId) {
      return
    }

    fetch(`${LAGO_URL}/wallets/${user.lagoWalletId}`, {
      headers: {
        authorization: 'Bearer 8de63c9a-e817-4bc7-84f2-73b0e27c26fa',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUsedCredits(response.consumed_credits)
        setTotalCredits(response.credits_balance)
      })
  }, [user && user.lagoWalletId])

  return user
    ? renderAuthenticatedHeader(user, usedCredits, totalCredits)
    : renderUnAuthenticatedHeader()
}
