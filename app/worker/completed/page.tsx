import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from "next/link"

export const dynamic = 'force-dynamic'

async function getCompletedJobs(userId: string) {
  return await prisma.job.findMany({
    where: {
      status: 'COMPLETED',
      assignments: {
        some: {
          OR: [
            { workerId: userId },
            { team: { members: { some: { userId: userId } } } }
          ]
        }
      }
    },
    include: {
      customer: {
        select: {
          company: true,
          address: true
        }
      },
      _count: {
        select: {
          steps: true
        }
      }
    },
    orderBy: {
      completedDate: 'desc'
    }
  })
}

export default async function CompletedJobsPage() {
  const session = await auth()
  if (!session || (session.user.role !== 'WORKER' && session.user.role !== 'TEAM_LEAD')) {
    redirect('/login')
  }

  try {
    const jobs = await getCompletedJobs(session.user.id)

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tamamlanmış İşler (Debug Modu)</h1>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded bg-white">
              <h2 className="font-bold">{job.title}</h2>
              <p>Müşteri: {job.customer.company}</p>
              <p>Tarih: {job.completedDate ? new Date(job.completedDate).toLocaleDateString('tr-TR') : '-'}</p>
              <Link href={`/worker/jobs/${job.id}`} className="text-blue-600 underline">Detay</Link>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-64">
          {JSON.stringify(jobs, null, 2)}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Completed Jobs Error:", error)
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Bir hata oluştu</h1>
        <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    )
  }
}
