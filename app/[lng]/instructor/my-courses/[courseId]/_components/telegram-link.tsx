'use client'

import { updateCourse } from '@/actions/course.action'
import { ICourse } from '@/app.types'
import FillLoading from '@/components/shared/fill-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import useToggleEdit from '@/hooks/use-toggle-edit'
import { telegramLinkSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function TelegramLink(course: ICourse) {
	const { state, onToggle } = useToggleEdit()

	return (
		<Card>
			<CardContent className='relative p-6'>
				<div className='flex items-center justify-between'>
					<span className='text-lg font-medium'>
						Telegram group (free course)
					</span>
					<Button size='icon' variant='ghost' onClick={onToggle}>
						{state ? <X /> : <Edit2 />}
					</Button>
				</div>
				<Separator className='my-3' />

				{state ? (
					<Forms course={course} onToggle={onToggle} />
				) : (
					<div className='flex items-center gap-2'>
						<span className='font-space-grotesk font-bold text-muted-foreground'>
							Invite link:
						</span>
						<span className='truncate font-medium'>
							{course.telegramInviteLink || 'Not set'}
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default TelegramLink

interface FormsProps {
	course: ICourse
	onToggle: () => void
}

function Forms({ course, onToggle }: FormsProps) {
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()

	const form = useForm({
		resolver: zodResolver(telegramLinkSchema),
		defaultValues: {
			telegramInviteLink: course.telegramInviteLink ?? '',
		},
	})

	const onSubmit = (values: z.infer<typeof telegramLinkSchema>) => {
		setIsLoading(true)
		const promise = updateCourse(
			course._id,
			{ telegramInviteLink: values.telegramInviteLink },
			pathname
		)
			.then(() => onToggle())
			.finally(() => setIsLoading(false))

		toast.promise(promise, {
			loading: 'Updating group link...',
			success: 'Group link updated!',
			error: 'Error updating group link.',
		})
	}

	return (
		<>
			{isLoading && <FillLoading />}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
					<FormField
						control={form.control as any}
						name='telegramInviteLink'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										placeholder='https://t.me/+xxxxxxxx'
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' disabled={isLoading}>
						Save
					</Button>
				</form>
			</Form>
		</>
	)
}