import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reset = searchParams.get('reset') === 'true'

    const commonPassword = await hash('123456', 10) // Basit şifre: 123456 (veya kullanıcı adına göre)

    const users = [
        {
            email: 'manager@montaj.com',
            name: 'Yönetici Ahmet',
            role: 'MANAGER',
            phone: '555-0002',
            password: 'manager123'
        },
        {
            email: 'worker@montaj.com',
            name: 'Montaj Elemanı Ali',
            role: 'WORKER',
            phone: '555-0003',
            password: 'worker123'
        },
        {
            email: 'customer@montaj.com',
            name: 'Müşteri Mehmet',
            role: 'CUSTOMER',
            phone: '555-0004',
            password: 'customer123'
        },
        {
            email: 'tahir@montaj.com',
            name: 'Tahir Kahraman',
            role: 'TEAM_LEAD',
            phone: '555-0011',
            password: 'tahir123'
        },
        {
            email: 'ali@montaj.com',
            name: 'Ali Gor',
            role: 'WORKER',
            phone: '555-0012',
            password: 'ali123'
        }
    ]

    const results = []

    for (const user of users) {
        const passwordHash = await hash(user.password, 10)

        const existing = await prisma.user.findUnique({
            where: { email: user.email }
        })

        if (existing) {
            if (reset || !existing.passwordHash || !existing.passwordHash.startsWith('$2')) {
                await prisma.user.update({
                    where: { email: user.email },
                    data: { passwordHash }
                })
                results.push(`✅ ${user.email} şifresi güncellendi (${user.password})`)
            } else {
                results.push(`ℹ️ ${user.email} zaten mevcut`)
            }
        } else {
            await prisma.user.create({
                data: {
                    email: user.email,
                    passwordHash,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                    isActive: true
                }
            })
            results.push(`🎉 ${user.email} oluşturuldu (${user.password})`)
        }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo kullanıcıları kontrol edildi.',
      details: results
    })
  } catch (error) {
    console.error('Seed demo users error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bir hata oluştu'
    }, { status: 500 })
  }
}
