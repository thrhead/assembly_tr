import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { z } from 'zod'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string; stepId: string }> }
) {
    const params = await props.params
    try {
        const session = await verifyAuth(req)
        if (!session || (session.user.role !== 'WORKER' && session.user.role !== 'TEAM_LEAD')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const contentType = req.headers.get('content-type') || ''
        let photoUrl: string = ''
        let subStepId: string | null = null

        if (contentType.includes('application/json')) {
            const body = await req.json()
            photoUrl = body.url
            subStepId = body.subStepId || null

            if (!photoUrl) {
                return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
            }
        } else {
            // FormData handler (disabled for Vercel/Serverless fs compatibility in this patch, using mock URL for now)
            // Ideally should upload to Cloudinary/S3
            return NextResponse.json({ error: 'File upload not supported in this environment yet. Please use URL.' }, { status: 400 })
        }

        const photo = await prisma.stepPhoto.create({
            data: {
                stepId: params.stepId,
                subStepId: subStepId || null,
                url: photoUrl,
                uploadedById: session.user.id
            },
            include: {
                uploadedBy: {
                    select: { name: true }
                }
            }
        })

        // Emit Socket.IO event
        const socketPayload = {
            jobId: params.id,
            stepId: params.stepId,
            subStepId: subStepId || null,
            photoUrl: photoUrl,
            uploadedBy: session.user.name || session.user.email || 'Unknown',
            uploadedAt: new Date()
        }

        // Import socket functions dynamically to avoid circular deps if any
        const { emitToUser, broadcast } = await import('@/lib/socket')

        // Notify team lead/manager/admin
        // Find relevant users (e.g. job creator, team lead)
        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: {
                creator: true,
                assignments: { include: { team: true } }
            }
        })

        if (job) {
            if (job.creatorId) emitToUser(job.creatorId, 'photo:uploaded', socketPayload)
            // Broadcast to admins/managers
            broadcast('photo:uploaded', socketPayload)
        }

        return NextResponse.json(photo)
    } catch (error) {
        console.error('Photo upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
