import { useRef, useState } from 'react'
import Layout from '~/layout/layout'
import {
  Flex,
  Container,
  Select,
  Button,
  TextArea,
  Callout,
  Heading,
  Skeleton,
} from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import '@radix-ui/themes/styles.css'

import { OpenAIModels, MistralModels } from '#types/models'
import {
  combinePromptString,
  codPromptString,
  summarizePromptString,
} from '../../resources/ts/utils/prompt'
import { InferPageProps } from '@adonisjs/inertia/types'
import HomeController from '#controllers/home_controller'

export default function Home({ user }: InferPageProps<HomeController, 'index'>) {
  const [summary, setSummary] = useState('')
  const [language, setLanguage] = useState('french')
  const [model, setModel] = useState<string>(OpenAIModels.GPT35Turbo)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [summaryPrompt, setSummaryPrompt] = useState<string>(summarizePromptString.trim())
  const [combinePrompt, setCombinePrompt] = useState<string>(combinePromptString.trim())

  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (evt: any) => {
    evt.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('document', fileRef.current!.files![0])
    formData.append('summaryPrompt', summaryPrompt.trim())
    formData.append('combinePrompt', combinePromptString.trim())

    fetch(`/upload?model=${model}&language=${language}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.text())
      .then((res) => setSummary(res))
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout user={user}>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col m-4">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input ref={fileRef} type="file" />
            <Flex direction="column" gap="2">
              <label htmlFor="language">Summary language</label>
              <Select.Root
                name="language"
                onValueChange={(value) => setLanguage(value)}
                defaultValue="french"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="french">Français</Select.Item>
                  <Select.Item value="english">Anglais</Select.Item>
                  <Select.Item value="dutch">Néerlandais</Select.Item>
                  <Select.Item value="german">Allemand</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex direction="column" gap="2">
              <label htmlFor="model">Model</label>
              <Select.Root
                onValueChange={(value) => setModel(value)}
                defaultValue={OpenAIModels.GPT4oMini}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>OPEN AI</Select.Label>
                    <Select.Item value={OpenAIModels.GPT35Turbo}>GPT 3.5 Turbo</Select.Item>
                    <Select.Item value={OpenAIModels.GPT4oMini}>GPT 4o-mini</Select.Item>
                    <Select.Item value={OpenAIModels.GPT4o}>GPT 4o</Select.Item>
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    <Select.Label>MISTRAL</Select.Label>
                    <Select.Item value={MistralModels.Nemo}>Mistral Nemo</Select.Item>
                    <Select.Item value={MistralModels.Small}>Mistral Small</Select.Item>
                    <Select.Item value={MistralModels.Large}>Mistral Large</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex direction="column" gap="3">
              <label>Summary Prompt</label>
              <Flex gap="3">
                <Button type="button" onClick={(_) => setSummaryPrompt(codPromptString.trim())}>
                  Chain of Density
                </Button>
                <Button
                  type="button"
                  onClick={(_) => setSummaryPrompt(summarizePromptString.trim())}
                >
                  Basic
                </Button>
              </Flex>
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  {
                    '{content} and {language} are placeholders for the input document content and output language.'
                  }
                </Callout.Text>
              </Callout.Root>
              <TextArea
                className="w-full h-[500px]"
                name="summaryPrompt"
                resize="none"
                value={summaryPrompt}
                onChange={(evt) => setSummaryPrompt(evt.target.value)}
              />
            </Flex>
            <Flex direction="column" gap="3">
              <label>Combine Prompt</label>
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Combine prompt is only required when dealing with long documents.
                </Callout.Text>
              </Callout.Root>
              <TextArea
                className="w-full h-[300px]"
                name="combinePrompt"
                resize="none"
                value={combinePrompt}
                onChange={(evt) => setCombinePrompt(evt.target.value)}
              />
            </Flex>
            <Button type="submit" loading={isLoading}>
              Upload
            </Button>
          </form>
        </div>
        <div className="flex flex-col h-[100%] m-4">
          <Heading as="h5">Summary</Heading>
          <Skeleton loading={isLoading} height="500px">
            <Container>{summary}</Container>
          </Skeleton>
        </div>
      </div>
    </Layout>
  )
}
