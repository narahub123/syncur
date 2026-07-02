import KeywordEditClient from "@/features/keywords/components/KeywordEditClient";

type Props = {
  params: Promise<{ keywordId: string }>;
};

export default async function KeywordDetailPage({ params }: Props) {
  const { keywordId } = await params;
  return <KeywordEditClient keywordId={keywordId} />;
}
