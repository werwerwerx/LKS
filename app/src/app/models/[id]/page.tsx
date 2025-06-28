import { ModelPageContent } from "@/components/model-card/model-page.content"


interface PageProps {
  params: {
    id: string
  }
}

export default async function ModelPage({ params }: PageProps) {
  const resolvedParams = await params
  const modelId = parseInt(resolvedParams.id)
  return <ModelPageContent modelId={modelId} />
}
