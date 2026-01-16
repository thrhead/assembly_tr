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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tamamlanmış İşler</h1>
          <p className="text-gray-600 mt-1">Tamamladığınız işlerin listesi</p>
        </div>

        {/* Stats Card */}
        <div className="mb-6 bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Tamamlanan İş</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-medium text-gray-900">Henüz tamamlanmış işiniz bulunmuyor</h3>
              <p className="text-gray-500 mt-1">Tamamladığınız işler burada görünecek.</p>
            </div>
          )}

          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold leading-tight text-gray-900">
                    {job.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Tamamlandı
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  🏢 <span className="truncate">{job.customer.company}</span>
                </div>
                {job.customer.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    📍 <span className="truncate">{job.customer.address}</span>
                  </div>
                )}
                {job.completedDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    📅 <span>{new Date(job.completedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  ✅ <span>{job._count.steps} adım tamamlandı</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3">
                <Link href={`/worker/jobs/${job.id}`} className="block w-full text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm font-medium">
                  Detayları Gör →
                </Link>
              </div>
            </div>
          ))}
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
