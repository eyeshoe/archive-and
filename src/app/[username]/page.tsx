import PublicArchive from '@/components/PublicArchive'

export default function UserArchivePage({ params }: { params: { username: string } }) {
  return <PublicArchive username={params.username} />
}

