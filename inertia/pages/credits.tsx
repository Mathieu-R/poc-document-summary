import Layout from '~/layout/layout'
import {
  Card,
  Text,
  Flex,
  Button
} from '@radix-ui/themes'

import '@radix-ui/themes/styles.css'

import { CREDITS, WALLET_RATE_AMOUNT } from '../../app/config';

import { InferPageProps } from '@adonisjs/inertia/types'
import type HomeController from '#controllers/home_controller'

export default function Credits({ user }: InferPageProps<HomeController, 'index'>) {
  console.log("hello")

  const buyCredits = async (amount: number) => {
    fetch(`/credits?amount=${amount}`, {
      method: "POST",
      credentials: "include"
    })
  }

  return (
    <Layout user={user}>
      <div className="grid place-items-center grid-cols-3 px-4 py-4">
        {CREDITS.map((amount, id) => {
          return (
            <Card className="flex flex-col" key={id}>
              <Flex direction="column" gap="2" align="center">
                <Text>{amount} crédits</Text>
                <Text>{amount * WALLET_RATE_AMOUNT}€</Text>
                <Button onClick={() => buyCredits(amount)}>Buy</Button>
              </Flex>
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}
