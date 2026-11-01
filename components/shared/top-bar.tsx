'use client'

import useTranslate from '@/hooks/use-translate'
import { Dot } from 'lucide-react'
import Link from 'next/link'

interface Props {
	label: string
	description?: string
	extra?: string
}

function TopBar({ label, extra, description }: Props) {
	const t = useTranslate()

	return (
		<>
			<div className='mt-[6.5rem] h-10 bg-gradient-to-r from-secondary to-primary sm:mt-28 sm:h-12'>
				<div className='mx-auto flex w-full max-w-6xl items-center px-4'>
					<div className='flex items-center'>
						<Link
							href={'/'}
							className='opacity-80 transition-opacity hover:opacity-95'
						>
							{t('home')}
						</Link>
						<Dot className='size-10 text-muted-foreground sm:size-12' />
						<p>{t(label)}</p>
						{extra && (
							<>
								<Dot className='size-10 text-muted-foreground sm:size-12' />
								<p>{t(extra)}</p>
							</>
						)}
					</div>
				</div>
			</div>

			{description && (
				<div className='mx-auto my-12 max-w-6xl px-4'>
					<h1 className='font-space-grotesk text-4xl font-bold'>{t(label)}</h1>
					<p className='mt-2 max-w-md text-muted-foreground'>
						{t(description)}
					</p>
				</div>
			)}
		</>
	)
}

export default TopBar
