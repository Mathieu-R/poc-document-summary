import { Link } from '@inertiajs/react'
import { Avatar, Button } from '@radix-ui/themes'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { InferPageProps } from '@adonisjs/inertia/types'
import HomeController from '#controllers/home_controller'

type User = InferPageProps<HomeController, 'index'>

const renderAuthenticatedHeader = ({ user }: User) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-2 shadow-md">
      <div className='flex items-center gap-10'>
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
      <a href={`/logout`}>
        <Button className="cursor-pointer">Logout</Button>
      </a>
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
  return user ? renderAuthenticatedHeader({user}) : renderUnAuthenticatedHeader()
}
