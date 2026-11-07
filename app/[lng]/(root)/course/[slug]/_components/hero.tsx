// 'use client'

// import useTranslate from '@/hooks/use-translate'
// import Image from 'next/image'
// import ReactStars from 'react-stars'
// import { PiStudentBold } from 'react-icons/pi'
// import { Clock3 } from 'lucide-react'
// import { ICourse } from '@/app.types'
// import { format } from 'date-fns'


// function Hero(course: ICourse) {
// 	const t = useTranslate()

// 	return (
// 		<>
// 			<h1 className='font-space-grotesk text-4xl font-bold'>
// 				{course.title}
// 			</h1>
// 			<p className='mt-4 text-muted-foreground'>
// 				{course.description}
// 			</p>
// 			<div className='mt-4 flex flex-wrap items-center gap-6'>
// 				<div className='flex items-center gap-2'>
// 					<Image
// 						width={50}
// 						height={50}
// 						alt={course.instructor.fullName}
// 						src={course.instructor.picture}
// 						className='rounded-full'
// 					/>
// 					<p className='font-space-grotesk font-bold'>
// 						{course.instructor.fullName}
// 					</p>
// 				</div>


// 				<div className='flex items-center gap-2 font-space-grotesk'>
// 					<p className='font-bold text-[#E59819]'>{course.rating}</p>
// 					<ReactStars value={course.rating} edit={false} color2='#E59819' />
// 					<p className='font-bold'>{course.reviewCount}</p>
// 				</div>

// 				<div className='flex items-center gap-2'>
// 					<PiStudentBold className='size-6' />
// 					<p className='font-space-grotesk font-bold'>{course.purchasedStudents} {t('students')}</p>
// 				</div>

// 				<div className='flex items-center gap-2'>
// 					<Clock3 className='size-6' />
// 					<p className='font-space-grotesk font-bold'>
// 						{t('lastUpdated')} {format(new Date(course.updatedAt), 'MM/yyyy')}
// 					</p>
// 				</div>
// 			</div>

// 			<Image
// 				src={course.previewImage}
// 				alt='course'
// 				width={1920}
// 				height={1080}
// 				className='mt-4 rounded-md object-cover'
// 			/>
// 		</>
// 	)
// }

// export default Hero
'use client'

import useTranslate from '@/hooks/use-translate'
import Image from 'next/image'
import ReactStars from 'react-stars'
import { PiStudentBold } from 'react-icons/pi'
import { Clock3, PauseCircle, Play, PlayCircle } from 'lucide-react'
import { ICourse, ILesson } from '@/app.types'
import { format } from 'date-fns'
import CustomImage from '@/components/shared/custom-image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { getFreeLessons } from '@/actions/lesson.action'
import { toast } from 'sonner'
import FillLoading from '@/components/shared/fill-loading'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { formatLessonTime } from '@/lib/utils'

function getVimeoEmbedUrl(videoUrl?: string) {
	if (!videoUrl) return ''

	try {
		const url = new URL(videoUrl)
		const videoId = url.pathname.match(/\/(\d+)/)?.[1]
		if (!videoId) return videoUrl

		const hash = url.pathname.match(/\/(\d+)\/([\w]+)/)?.[2] ?? url.searchParams.get('h')
		return `https://player.vimeo.com/video/${videoId}${hash ? `?h=${hash}` : ''}`
	} catch {
		return ''
	}
}

function Hero(course: ICourse) {
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [lessons, setLessons] = useState<ILesson[]>([])
	const [lesson, setLesson] = useState<ILesson | null>(null)

	const t = useTranslate()

	const onHandler = async () => {
		if (lessons.length > 0) return setOpen(true)

		setLoading(true)

		const promise = getFreeLessons(course._id)
			.then(data => {
				if (data.length === 0) return toast.error(t('notFound'))
				setLessons(data)
				setLesson(data[0])
				setOpen(true)
			})
			.finally(() => setLoading(false))

		toast.promise(promise, {
			loading: t('loading'),
			success: t('successfully'),
			error: t('error'),
		})
	}

	return (
		<>
			<h1 className='font-space-grotesk text-4xl font-bold'>{course.title}</h1>

			<p className='mt-4 text-muted-foreground'>{course.description}</p>

			<div className='mt-4 flex flex-wrap items-center gap-6'>
				<div className='flex items-center gap-2'>
					<Image
						width={50}
						height={50}
						alt={course.instructor.fullName}
						src={course.instructor.picture}
						className='rounded-full'
					/>
					<p className='font-space-grotesk font-bold'>
						{course.instructor.fullName}
					</p>
				</div>

				<div className='flex items-center gap-2 font-space-grotesk'>
					<p className='font-bold text-[#E59819]'>{course.rating}</p>
					<ReactStars value={course.rating} edit={false} color2='#E59819' />
					<p className='font-bold'>({course.reviewCount})</p>
				</div>

				<div className='flex items-center gap-2'>
					<PiStudentBold className='size-6' />
					<p className='font-space-grotesk font-bold'>
						{course.purchasedStudents} {t('students')}
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Clock3 className='size-6' />
					<p className='font-space-grotesk font-bold'>
						{t('lastUpdated')} {format(new Date(course.updatedAt), 'MM/yyyy')}
					</p>
				</div>
			</div>

			<div className='relative h-96 w-full'>
				<CustomImage
					src={course.previewImage}
					alt='course'
					className='mt-4 rounded-md'
				/>
				{loading && <FillLoading />}
				<Button
					size={'icon'}
					className='absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2'
					rounded={'full'}
					variant={'secondary'}
					onClick={onHandler}
					disabled={loading}
				>
					<Play className='size-10' />
				</Button>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className='custom-scrollbar max-h-full max-w-full overflow-y-auto md:max-w-4xl'>
					<iframe
						src={getVimeoEmbedUrl(lesson?.videoUrl)}
						className='aspect-video w-full'
						allow='autoplay; fullscreen; picture-in-picture'
						allowFullScreen
						title={lesson?.title ?? t('freeLessons')}
					/>
					<h1 className='font-space-grotesk text-2xl font-bold'>
						{t('freeLessons')}
					</h1>
					<div className='flex flex-col'>
						{lessons.map(item => (
							<div
								key={item._id}
								className='flex cursor-pointer items-center justify-between gap-2 border-t p-4 transition-colors hover:bg-secondary'
								onClick={() => setLesson(item)}
							>
								<div className='flex items-center gap-2'>
									{lesson?._id === item._id ? (
										<PauseCircle className='text-blue-500' />
									) : (
										<PlayCircle />
									)}
									<p className='font-space-grotesk font-bold'>{item.title}</p>
								</div>

								<p className='font-space-grotesk text-muted-foreground'>
									{formatLessonTime(item!)}
								</p>
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Hero