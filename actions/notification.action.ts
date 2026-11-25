'use server'

import Notification from '@/database/notification.model'
import { connectToDatabase } from '@/lib/mongoose'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

export const sendNotification = async (clerkId: string, message: string) => {
	try {
		await connectToDatabase()
		await Notification.create({ user: clerkId, message })
	} catch (error) {
		throw new Error('Error sending notification')
	}
}

export const getCount = async (clerkId: string) => {
    const userId = await requireOwner(clerkId)

    await connectToDatabase()

    return await Notification.countDocuments({
        user: userId,
        isRead: false,
    })
}

export const getNotifications = async (clerkId: string) => {
    const userId = await requireOwner(clerkId)

    await connectToDatabase()

    const notifications = await Notification.find({
        user: userId,
    }).sort({ createdAt: -1 })

    if (notifications.length > 0) {
        await Notification.updateMany(
            {
                user: userId,
                _id: {
                    $in: notifications.map(n => n._id),
                },
            },
            {
                $set: { isRead: true },
            }
        )
    }

    return notifications
}

export const clearNotifications = async (
    clerkId: string,
    path: string
) => {
    const userId = await requireOwner(clerkId)

    await connectToDatabase()

    await Notification.deleteMany({
        user: userId,
    })

    revalidatePath(path)
}

export const deleteNotification = async (
    id: string,
    path: string
) => {
    const userId = await requireOwner()

    await connectToDatabase()

    await Notification.deleteOne({
        _id: id,
        user: userId,
    })

    revalidatePath(path)
}

async function requireOwner(clerkId?: string) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('Unauthorized')
    }

    if (clerkId !== undefined && clerkId !== userId) {
        throw new Error('Forbidden')
    }

    return userId
}