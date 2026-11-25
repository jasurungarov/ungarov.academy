'use server'

import { connectToDatabase } from '@/lib/mongoose'
import { GetPaginationParams, IUpdateUser } from './types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Review from '@/database/review.model'
import Course from '@/database/course.model'
import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import Notification from '@/database/notification.model'


export const updateUser = async (data: IUpdateUser) => {
	try {
		const { userId } = await auth()

		if (!userId) {
			throw new Error('Unauthorized')
		}

		await connectToDatabase()

		const { clerkId, updatedData, path } = data

		const session = await User.db.startSession()

		try {
			await session.withTransaction(async () => {
				// Check current user permissions
				const actor = await User.findOne({
					clerkId: userId,
				})
					.select('role isAdmin')
					.session(session)

				if (!actor) {
					throw new Error('User not found')
				}

				const isAdmin = actor.isAdmin === true
				const isOwner = userId === clerkId

				if (!isOwner && !isAdmin) {
					throw new Error('Forbidden')
				}

				// Allowed profile fields
				const profileFields = new Set([
					'fullName',
					'bio',
					'phone',
					'job',
					'website',
					'linkedin',
					'github',
					'youtube',
				])

				const safeData: Record<string, string | boolean> = {}

				// Validate requested updates
				for (const [key, value] of Object.entries(updatedData)) {
					if (profileFields.has(key)) {
						if (!isOwner || typeof value !== 'string') {
							throw new Error('Invalid profile update')
						}

						safeData[key] = value
						continue
					}

					if (key === 'approvedInstructor') {
						if (
							typeof value !== 'boolean' ||
							(!isAdmin && (!isOwner || value !== true))
						) {
							throw new Error('Forbidden instructor update')
						}

						safeData[key] = value
						continue
					}

					if (key === 'role') {
						if (
							!isAdmin ||
							(value !== 'user' && value !== 'instructor')
						) {
							throw new Error('Forbidden role update')
						}

						safeData[key] = value
						continue
					}

					if (key === 'isAdmin') {
						if (!isAdmin || typeof value !== 'boolean') {
							throw new Error('Forbidden admin update')
						}

						safeData[key] = value
						continue
					}

					throw new Error(`Invalid update field: ${key}`)
				}

				if (!Object.keys(safeData).length) {
					throw new Error('No valid fields to update')
				}

				// Update user and retrieve previous state
				const previousUser = await User.findOneAndUpdate(
					{ clerkId },
					{ $set: safeData },
					{
						new: false,
						runValidators: true,
						session,
					}
				)

				if (!previousUser) {
					throw new Error('User not found')
				}

				const messages: string[] = []

				// Instructor application notification
				if (
					safeData.approvedInstructor === true &&
					previousUser.approvedInstructor !== true
				) {
					messages.push('messageInstructorApproved')
				}

				// Instructor removal notification
				if (
					safeData.approvedInstructor === false &&
					previousUser.approvedInstructor === true
				) {
					messages.push('messageDeleteInstructor')
				} else if (
					typeof safeData.role === 'string' &&
					previousUser.role !== safeData.role
				) {
					// Role change notification
					messages.push(`messageRoleChanged ${safeData.role}`)
				}

				// Admin permission notification
				if (
					typeof safeData.isAdmin === 'boolean' &&
					previousUser.isAdmin !== safeData.isAdmin
				) {
					messages.push(
						safeData.isAdmin
							? 'messageYoureAdmin'
							: 'messageYoureNotAdmin'
					)
				}

				// Create notifications inside the transaction
				if (messages.length > 0) {
					await Notification.create(
						messages.map(message => ({
							user: clerkId,
							message,
						})),
						{ session }
					)
				}
			})
		} finally {
			await session.endSession()
		}

		// Revalidate affected page
		if (path) {
			revalidatePath(path)
		}

		return true
	} catch (error) {
		console.error('Error updating user:', error)
		throw new Error('Unable to update user')
	}
}

export const getUserById = cache (async (clerkId: string) => {
	try {
		await connectToDatabase()
		return await User.findOne({ clerkId })
	} catch (error) {
		throw new Error('Error fetching user. Please try again.')
	}
})

export const getUser = async (clerkId: string) => {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId }).select(
			'fullName picture clerkId email role isAdmin'
		)
		
		if (!user) return 'notFound'
		return JSON.parse(JSON.stringify(user))
	} catch (error) {
		throw new Error('Error fetching user. Please try again.')
	}
}

export const getUserReviews = async (clerkId: string) => {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId }).select('_id')

		const reviews = await Review.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({ path: 'user', model: User, select: 'fullName picture' })
			.populate({ path: 'course', model: Course, select: 'title' })

		return reviews
	} catch (error) {
		throw new Error('Error getting user reviews')
	}
}

export const getAdminInstructors = async (params: GetPaginationParams) => {
	try {
		await connectToDatabase()
		const { page = 1, pageSize = 3 } = params

		const skipAmount = (page - 1) * pageSize

		const instructors = await User.find({ role: 'instructor' })
			.skip(skipAmount)
			.limit(pageSize)
			.sort({ createdAt: -1 })

		const totalInstructors = await User.countDocuments({ role: 'instructor' })
		const isNext = totalInstructors > skipAmount + instructors.length

		return { instructors, isNext, totalInstructors }
	} catch (error) {
		throw new Error('Error getting instructors')
	}
}

export const getInstructors = async () => {
	try {
		await connectToDatabase()
		return await User.find({ approvedInstructor: true }).select(
			'isAdmin role email website youtube github job clerkId'
		)
	} catch (error) {
		throw new Error('Error getting instructors')
	}
}

export const getRole = async (clerkId: string) => {
	try {
		await connectToDatabase()
		const user = await User.findOne({ clerkId }).select('role isAdmin')
		return user
	} catch (error) {
		throw new Error('Error getting role')
	}
}