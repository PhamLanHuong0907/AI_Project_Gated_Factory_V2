// @ts-nocheck
import { useState, useEffect } from 'react'
import { Download, Calendar, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { api } from '../services/api'
import { useAuth } from '../services/auth-context'

/**
 * SCR-08 — Báo cáo lương nhân viên
 * View salary breakdown + Export to Excel
 */

interface SalaryRecord {
  userId: string
  fullName: string
  employeeCode: string
  position: string
  baseSalary: number
  bonuses: number
  penalties: number
  netSalary: number
}

const fmt = (n: number) => n.toLocaleString('vi-VN')

export function SalaryReportPage() {
  const { user, loading: authLoading } = useAuth()
  const [records, setRecords] = useState<SalaryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const loadData = async () => {
    try {
      setLoading(true)
      let data = await api.salary.report(month)
      if (user?.role === 'EMPLOYEE') {
        data = (data as SalaryRecord[]).filter(r => r.userId === user.id)
      }
      setRecords(data as SalaryRecord[])
    } catch (err) {
      console.error('Failed to load salary report:', err)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadData()
    }
  }, [month, authLoading, user])

  const totalBase = records.reduce((s, r) => s + r.baseSalary, 0)
  const totalBonus = records.reduce((s, r) => s + r.bonuses, 0)
  const totalPenalty = records.reduce((s, r) => s + r.penalties, 0)
  const totalNet = records.reduce((s, r) => s + r.netSalary, 0)

  const exportToExcel = () => {
    const wsData = [
      ['BÁO CÁO LƯƠNG THÁNG ' + month],
      [],
      ['STT', 'Mã NV', 'Họ và tên', 'Vị trí', 'Lương cơ bản (đã tính KN)', 'Thưởng', 'Phạt', 'Lương thực nhận'],
      ...records.map((r, i) => [
        i + 1,
        r.employeeCode,
        r.fullName,
        r.position,
        r.baseSalary,
        r.bonuses,
        r.penalties,
        r.netSalary,
      ]),
      [],
      ['', '', '', 'TỔNG CỘNG', totalBase, totalBonus, totalPenalty, totalNet],
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    ws['!cols'] = [
      { wch: 5 }, { wch: 10 }, { wch: 25 }, { wch: 15 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo lương')
    XLSX.writeFile(wb, `bao-cao-luong-${month}.xlsx`)
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-xl font-semibold text-neutral-text-primary">Báo cáo lương</h2>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <Calendar size={16} className="text-neutral-text-muted" />
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
          </div>
          <button onClick={exportToExcel} disabled={loading || records.length === 0}
            className="flex items-center gap-sm rounded bg-green-600 px-md py-sm text-body-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <div className="card p-md text-center">
          <div className="text-label-xs text-neutral-text-muted mb-sm">Tổng lương cơ bản</div>
          <div className="text-headline-lg font-bold text-primary">{fmt(totalBase)} ₫</div>
        </div>
        <div className="card p-md text-center">
          <div className="text-label-xs text-neutral-text-muted mb-sm">Tổng Thưởng</div>
          <div className="text-headline-lg font-bold text-green-600">{fmt(totalBonus)} ₫</div>
        </div>
        <div className="card p-md text-center">
          <div className="text-label-xs text-neutral-text-muted mb-sm">Tổng phạt</div>
          <div className="text-headline-lg font-bold text-error">{fmt(totalPenalty)} ₫</div>
        </div>
        <div className="card p-md text-center">
          <div className="text-label-xs text-neutral-text-muted mb-sm">Tổng lương thực nhận</div>
          <div className="text-headline-lg font-bold text-primary">{fmt(totalNet)} ₫</div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-xl">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>MÃ NV</th>
                <th>HỌ VÀ TÊN</th>
                <th>VỊ TRÍ</th>
                <th>LƯƠNG CƠ BẢN (GỒM KN)</th>
                <th>THƯỞNG</th>
                <th>PHẠT</th>
                <th>LƯƠNG THỰC NHẬN</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.userId}>
                  <td className="font-mono text-neutral-text-secondary">{r.employeeCode}</td>
                  <td className="font-medium text-neutral-text-primary">{r.fullName}</td>
                  <td className="text-neutral-text-secondary">{r.position}</td>
                  <td className="text-neutral-text-secondary">{fmt(r.baseSalary)}</td>
                  <td className="text-green-600">+{fmt(r.bonuses)}</td>
                  <td className="text-error">-{fmt(r.penalties)}</td>
                  <td className="font-bold text-primary">{fmt(r.netSalary)}</td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-neutral-surface font-bold">
                <td colSpan={3}>TỔNG CỘNG</td>
                <td>{fmt(totalBase)}</td>
                <td className="text-green-600">+{fmt(totalBonus)}</td>
                <td className="text-error">-{fmt(totalPenalty)}</td>
                <td className="text-primary">{fmt(totalNet)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
