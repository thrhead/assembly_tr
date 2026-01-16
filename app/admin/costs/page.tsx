'use client'

import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import { CheckCircle2Icon, XCircleIcon, ExternalLinkIcon, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CostListSkeleton } from '@/components/skeletons/cost-list-skeleton'

interface Cost {
    id: string
    amount: number
    currency: string
    category: string
    description: string
    date: string
    status: string
    receiptUrl?: string
    rejectionReason?: string
    job: {
        title: string
        customer: {
            company: string
        }
    }
    createdBy: {
        name: string
        email: string
    }
    approvedBy?: {
        name: string
    }
}

export default function CostsPage() {
    const [costs, setCosts] = useState<Cost[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
    const [rejectDialog, setRejectDialog] = useState<{ id: string, open: boolean }>({ id: '', open: false })
    const [rejectionReason, setRejectionReason] = useState('')
    const [processing, setProcessing] = useState<string | null>(null)

    useEffect(() => {
        fetchCosts()
    }, [])

    const fetchCosts = async () => {
        try {
            const res = await fetch('/api/admin/costs')
            if (res.ok) {
                const data = await res.json()
                setCosts(data)
            }
        } catch (error) {
            console.error('Failed to fetch costs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
        setProcessing(id)
        try {
            const res = await fetch(`/api/admin/costs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, rejectionReason: reason })
            })

            if (res.ok) {
                fetchCosts()
                setRejectDialog({ id: '', open: false })
                setRejectionReason('')
            } else {
                toast.error('İşlem başarısız')
            }
        } catch (error) {
            console.error(error)
            toast.error('Bir hata oluştu')
        } finally {
            setProcessing(null)
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-600">Onaylandı</Badge>
            case 'REJECTED':
                return <Badge variant="destructive">Reddedildi</Badge>
            default:
                return <Badge variant="secondary">Bekliyor</Badge>
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Maliyet Yönetimi</h2>
                </div>
                <CostListSkeleton />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Maliyet Yönetimi</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm Masraflar</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarih</TableHead>
                                <TableHead>İş / Müşteri</TableHead>
                                <TableHead>Ekleyen</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Açıklama</TableHead>
                                <TableHead>Tutar</TableHead>
                                <TableHead>Fiş</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                                        Kayıt bulunamadı
                                    </TableCell>
                                </TableRow>
                            ) : (
                                costs.map((cost) => (
                                    <TableRow key={cost.id}>
                                        <TableCell>
                                            {format(new Date(cost.date), 'd MMM yyyy', { locale: tr })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{cost.job.title}</div>
                                            <div className="text-xs text-muted-foreground">{cost.job.customer.company}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{cost.createdBy.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{cost.category}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={cost.description}>
                                            {cost.description}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {formatCurrency(cost.amount, cost.currency)}
                                        </TableCell>
                                        <TableCell>
                                            {cost.receiptUrl ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedReceipt(cost.receiptUrl!)}
                                                >
                                                    <ExternalLinkIcon className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(cost.status)}
                                            {cost.status === 'REJECTED' && cost.rejectionReason && (
                                                <div className="text-xs text-red-500 mt-1">{cost.rejectionReason}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {cost.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleUpdateStatus(cost.id, 'APPROVED')}
                                                        disabled={processing === cost.id}
                                                    >
                                                        {processing === cost.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2Icon className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setRejectDialog({ id: cost.id, open: true })}
                                                        disabled={processing === cost.id}
                                                    >
                                                        <XCircleIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Receipt Preview Dialog */}
            <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Fiş Görüntüle</DialogTitle>
                    </DialogHeader>
                    {selectedReceipt && (
                        <div className="relative h-[60vh] w-full rounded-md overflow-hidden bg-black/5 flex items-center justify-center">
                            <img src={selectedReceipt} alt="Receipt" className="max-h-full max-w-full object-contain" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog(prev => ({ ...prev, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Red Nedeni</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Açıklama</Label>
                            <Input
                                placeholder="Neden reddedildiğini yazın..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setRejectDialog({ id: '', open: false })}>İptal</Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleUpdateStatus(rejectDialog.id, 'REJECTED', rejectionReason)}
                                disabled={!rejectionReason || processing === rejectDialog.id}
                            >
                                {processing === rejectDialog.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reddet
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
