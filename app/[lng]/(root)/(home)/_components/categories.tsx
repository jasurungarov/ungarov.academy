'use client'

import CategoryCard from '@/components/cards/category.card'
import { categories } from '@/constants'
import useTranslate from '@/hooks/use-translate'

function Categories() {
	const t = useTranslate()

	return (
		<div className='mx-auto max-w-6xl px-4 py-12'>
			<div className='flex flex-col space-y-1'>
				<h1 className='font-space-grotesk text-2xl font-bold sm:text-3xl'>
					{t('topCategories')}
				</h1>
				<p className='text-xs text-muted-foreground sm:text-sm'>
					{t('topCategoriesDescription')}
				</p>
			</div>

			<div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{categories.map(category => (
					<CategoryCard key={category.label} {...category} />
				))}
			</div>
		</div>
	)
}

export default Categories
