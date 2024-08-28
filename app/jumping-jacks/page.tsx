import dynamic from 'next/dynamic'

const JumpingJacksDemo = dynamic(() => import('@/components/JumpingJacksDemo'), { ssr: false })

export default function Page() {
  return <JumpingJacksDemo />
}