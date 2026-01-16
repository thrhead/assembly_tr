import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getWorkerJobs } from "@/lib/data/worker-dashboard"

export const dynamic = 'force-dynamic'

const priorityLabels: Record<string, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil"
}

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal"
}

export default async function WorkerDashboard() {
  const session = await auth()
  if (!session || (session.user.role !== "WORKER" && session.user.role !== "TEAM_LEAD")) {
    redirect("/login")
  }

  try {
    const jobs = await getWorkerJobs(session.user.id)

    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İşlerim</h1>
        <p className="text-gray-500">Size atanan aktif işler ({jobs.length})</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold leading-tight text-gray-900">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    🏢 {job.customer.company}
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {priorityLabels[job.priority] || job.priority}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                📍 <span className="line-clamp-2">{job.location || job.customer.address || "Adres belirtilmemiş"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                📅 <span>
                  {job.scheduledDate 
                    ? new Date(job.scheduledDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : "Tarih belirtilmemiş"
                  }
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-50 border rounded text-gray-700">
                  {statusLabels[job.status] || job.status}
                </span>
                {job._count.steps > 0 && (
                  <span className="text-xs text-gray-500">
                    {job._count.steps} Adım
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-3">
              <Link href={`/worker/jobs/${job.id}`} className="block w-full text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm font-medium">
                Detayları Gör →
              </Link>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-lg font-medium text-gray-900">Aktif işiniz bulunmuyor</h3>
            <p className="text-gray-500 mt-1">Yeni iş atandığında burada göreceksiniz.</p>
          </div>
        )}
      </div>
    </div>
    )
  } catch (error) {
    console.error("Worker Dashboard Error:", error)
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Bir hata oluştu</h1>
        <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </pre>
      </div>
    )
  }
}
