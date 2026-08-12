// @ts-nocheck
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Save, Loader2, DollarSign, Briefcase, Award, AlertTriangle, Gift, Users, Check, Calculator } from 'lucide-react'
import { api } from '../services/api'

/**
 * SCR-07 — Cấu hình lương (6 tabs)
 * Vị trí, Kinh nghiệm, Phạt, Thưởng, Công thức, Cấu hình lương nhân viên
 */

type SalaryTab = 'positions' | 'penalties' | 'bonus' | 'employee-config' | 'formula'

interface ExperienceDto { id?: string; name: string; minYears: number; maxYears: number | null; salaryAmount: number }
interface Position { id: string; name: string; baseSalary: number; description: string; isActive: boolean; experiences: ExperienceDto[] }
interface Penalty { id: string; name: string; penaltyType: string; amount: number; description: string; isActive: boolean }
interface Bonus { id: string; name: string; bonusType: string; amount: number; description: string; isActive: boolean }
interface Employee { id: string; fullName: string; employeeCode: string; email: string }

const fmt = (n: number) => n.toLocaleString('vi-VN') + ' VNĐ'

export function SalaryConfigPage() {
  const [activeTab, setActiveTab] = useState<SalaryTab>('positions')

  const tabs: { key: SalaryTab; label: string; icon: typeof DollarSign }[] = [
    { key: 'positions', label: 'Vị trí', icon: Briefcase },
    { key: 'bonus', label: 'Thưởng', icon: Gift },
    { key: 'penalties', label: 'Phạt', icon: AlertTriangle },
    { key: 'employee-config', label: 'Lương nhân viên', icon: Users },
    { key: 'formula', label: 'Công thức', icon: Calculator },
  ]

  return (
    <div className="space-y-lg">
      <h2 className="text-headline-xl font-semibold text-neutral-text-primary">Cấu hình lương hệ thống</h2>
      <div className="flex flex-wrap gap-2 border-b border-neutral-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-sm border-b-2 px-md py-sm text-body-sm font-medium transition-colors ${
                activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-neutral-text-muted hover:text-neutral-text-primary'
              }`}>
              <Icon size={16} /> {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'positions' && <PositionsTab />}
      {activeTab === 'penalties' && <PenaltiesTab />}
      {activeTab === 'bonus' && <BonusTab />}
      {activeTab === 'employee-config' && <EmployeeSalaryConfig />}
      {activeTab === 'formula' && <FormulaTab />}
    </div>
  )
}

// ─── Positions Tab ───────────────────────────────────────────
function PositionsTab() {
  const [items, setItems] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Position | null>(null)
  const [form, setForm] = useState<{ name: string; baseSalary: string; description: string; experiences: ExperienceDto[] }>({ name: '', baseSalary: '', description: '', experiences: [] })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async () => {
    try { setLoading(true); const d = await api.salary.positions(); setItems(d) }
    catch (e) { console.error('Failed to load positions:', e); setItems([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm({ name: '', baseSalary: '', description: '', experiences: [] }); setShowForm(true) }
  const openEdit = (item: Position) => { 
    setEditItem(item); 
    setForm({ 
      name: item.name, 
      baseSalary: String(item.baseSalary), 
      description: item.description,
      experiences: item.experiences || [] 
    }); 
    setShowForm(true) 
  }

  const handleAddExp = () => {
    setForm({ ...form, experiences: [...form.experiences, { name: '', minYears: 0, maxYears: null, salaryAmount: 0 }] })
  }
  
  const handleRemoveExp = (index: number) => {
    const exps = [...form.experiences]
    exps.splice(index, 1)
    setForm({ ...form, experiences: exps })
  }
  
  const handleExpChange = (index: number, field: keyof ExperienceDto, value: any) => {
    const exps = [...form.experiences]
    exps[index] = { ...exps[index], [field]: value }
    setForm({ ...form, experiences: exps })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = { 
        name: form.name, 
        baseSalary: Number(form.baseSalary), 
        description: form.description, 
        isActive: true,
        experiences: form.experiences 
      }
      if (editItem) { await api.salary.updatePosition(editItem.id, payload) }
      else { await api.salary.createPosition(payload) }
      setShowForm(false); load()
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try { await api.salary.deletePosition(id); setDeleteId(null); load() } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="space-y-md">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark"><Plus size={16} /> Thêm vị trí</button>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-xl"><Loader2 className="animate-spin text-primary" /></div> : (
          <table className="data-table">
            <thead><tr><th>TÊN VỊ TRÍ</th><th>LƯƠNG CƠ BẢN</th><th>KINH NGHIỆM</th><th>MÔ TẢ</th><th>THAO TÁC</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-neutral-text-primary">{item.name}</td>
                  <td className="text-neutral-text-secondary">{fmt(item.baseSalary)}</td>
                  <td className="text-neutral-text-secondary">
                    {item.experiences && item.experiences.length > 0 ? (
                      <div className="text-xs space-y-1">
                        {item.experiences.map((exp, i) => (
                          <div key={i}>{exp.name} ({exp.minYears} - {exp.maxYears || '∞'} năm): <span className="font-medium">{fmt(exp.salaryAmount)}</span></div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-neutral-text-muted italic">Không có mốc</span>
                    )}
                  </td>
                  <td className="text-neutral-text-secondary">{item.description}</td>
                  <td><div className="flex gap-sm">
                    <button onClick={() => openEdit(item)} className="rounded p-1 hover:bg-neutral-surface hover:text-primary"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="rounded p-1 hover:bg-neutral-surface hover:text-error"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <div className="flex items-center justify-between p-lg border-b border-neutral-border">
              <h3 className="text-headline-lg font-semibold">{editItem ? 'Sửa vị trí' : 'Thêm vị trí mới'}</h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-neutral-surface"><X size={20} /></button>
            </div>
            
            <form className="flex flex-col flex-1 overflow-hidden" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
              <div className="flex-1 overflow-y-auto p-lg space-y-md">
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-1">
                    <label className="text-label-xs font-medium text-neutral-text-secondary">Tên vị trí *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-xs font-medium text-neutral-text-secondary">Lương cơ bản (VNĐ) *</label>
                    <input type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Mô tả</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
                </div>
                
                <div className="mt-xl pt-md border-t border-neutral-border">
                  <div className="flex items-center justify-between mb-sm">
                    <h4 className="text-body-md font-semibold text-neutral-text-primary">Mốc kinh nghiệm</h4>
                    <button type="button" onClick={handleAddExp} className="flex items-center gap-xs text-xs font-medium text-primary hover:text-primary-dark">
                      <Plus size={14} /> Thêm mốc
                    </button>
                  </div>
                  
                  {form.experiences.length === 0 ? (
                    <p className="text-body-sm text-neutral-text-muted italic py-md text-center bg-neutral-surface/50 rounded border border-neutral-border border-dashed">
                      Chưa có cấu hình mốc kinh nghiệm. Lương mặc định sẽ bằng Lương cơ bản.
                    </p>
                  ) : (
                    <div className="space-y-sm">
                      {form.experiences.map((exp, i) => (
                        <div key={i} className="flex items-start gap-sm p-sm border border-neutral-border rounded bg-neutral-surface/30">
                          <div className="flex-1 grid grid-cols-12 gap-sm">
                            <div className="col-span-12 sm:col-span-4 space-y-1">
                              <label className="text-[10px] uppercase font-bold text-neutral-text-muted">Tên (VD: 1-3 năm)</label>
                              <input type="text" value={exp.name} onChange={(e) => handleExpChange(i, 'name', e.target.value)} required className="w-full rounded border border-neutral-border px-xs py-1 text-xs focus:border-primary focus:outline-none" />
                            </div>
                            <div className="col-span-4 sm:col-span-2 space-y-1">
                              <label className="text-[10px] uppercase font-bold text-neutral-text-muted">Từ (năm)</label>
                              <input type="number" step="0.1" value={exp.minYears} onChange={(e) => handleExpChange(i, 'minYears', Number(e.target.value))} required className="w-full rounded border border-neutral-border px-xs py-1 text-xs focus:border-primary focus:outline-none" />
                            </div>
                            <div className="col-span-4 sm:col-span-2 space-y-1">
                              <label className="text-[10px] uppercase font-bold text-neutral-text-muted">Đến (năm)</label>
                              <input type="number" step="0.1" value={exp.maxYears || ''} onChange={(e) => handleExpChange(i, 'maxYears', e.target.value ? Number(e.target.value) : null)} className="w-full rounded border border-neutral-border px-xs py-1 text-xs focus:border-primary focus:outline-none" placeholder="∞" />
                            </div>
                            <div className="col-span-4 sm:col-span-4 space-y-1">
                              <label className="text-[10px] uppercase font-bold text-neutral-text-muted">Lương (VNĐ)</label>
                              <input type="number" value={exp.salaryAmount} onChange={(e) => handleExpChange(i, 'salaryAmount', Number(e.target.value))} required className="w-full rounded border border-neutral-border px-xs py-1 text-xs focus:border-primary focus:outline-none" />
                            </div>
                          </div>
                          <button type="button" onClick={() => handleRemoveExp(i)} className="p-1 mt-[18px] text-neutral-text-muted hover:text-error rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-sm p-lg border-t border-neutral-border bg-neutral-surface">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
                <button type="submit" disabled={saving} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {editItem ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-sm p-lg">
            <h3 className="text-headline-lg font-semibold mb-md">Xác nhận xóa</h3>
            <p className="text-body-sm text-neutral-text-secondary mb-lg">Xóa vị trí này?</p>
            <div className="flex justify-end gap-sm">
              <button onClick={() => setDeleteId(null)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="rounded bg-error px-md py-sm text-body-sm font-medium text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



// ─── Bonus Tab ───────────────────────────────────────────
function BonusTab() {
  const [items, setItems] = useState<Bonus[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Bonus | null>(null)
  const [form, setForm] = useState({ name: '', bonusType: 'PERFORMANCE', amount: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const BONUS_TYPES = [
    { value: 'PERFORMANCE', label: 'Hiệu suất' },
    { value: 'ATTENDANCE', label: 'Chuyên cần' },
    { value: 'PROJECT', label: 'Dự án' },
    { value: 'HOLIDAY', label: 'Lễ/Tết' },
    { value: 'OTHER', label: 'Khác' },
  ]

  const load = async () => {
    try { setLoading(true); const d = await api.salary.bonus(); setItems(d) }
    catch (e) { console.error('Failed to load bonus:', e); setItems([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm({ name: '', bonusType: 'PERFORMANCE', amount: '', description: '' }); setShowForm(true) }
  const openEdit = (item: Bonus) => { setEditItem(item); setForm({ name: item.name, bonusType: item.bonusType, amount: String(item.amount), description: item.description }); setShowForm(true) }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = { name: form.name, bonusType: form.bonusType, amount: Number(form.amount), description: form.description, isActive: true }
      if (editItem) { await api.salary.updateBonus(editItem.id, payload) }
      else { await api.salary.createBonus(payload) }
      setShowForm(false); load()
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try { await api.salary.deleteBonus(id); setDeleteId(null); load() } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="space-y-md">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark"><Plus size={16} /> Thêm khoản thưởng</button>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-xl"><Loader2 className="animate-spin text-primary" /></div> : (
          <table className="data-table">
            <thead><tr><th>TÊN</th><th>LOẠI</th><th>SỐ TIỀN</th><th>MÔ TẢ</th><th>THAO TÁC</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-neutral-text-primary">{item.name}</td>
                  <td><span className="badge-status bg-success-light text-success">{BONUS_TYPES.find(t => t.value === item.bonusType)?.label || item.bonusType}</span></td>
                  <td className="text-neutral-text-secondary">{fmt(item.amount)}</td>
                  <td className="text-neutral-text-secondary">{item.description}</td>
                  <td><div className="flex gap-sm">
                    <button onClick={() => openEdit(item)} className="rounded p-1 hover:bg-neutral-surface hover:text-primary"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="rounded p-1 hover:bg-neutral-surface hover:text-error"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md p-lg">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-lg font-semibold">{editItem ? 'Sửa khoản thưởng' : 'Thêm khoản thưởng mới'}</h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-neutral-surface"><X size={20} /></button>
            </div>
            <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Tên *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Loại thưởng *</label>
                  <select value={form.bonusType} onChange={(e) => setForm({ ...form, bonusType: e.target.value })} className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none">
                    {BONUS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Số tiền (VNĐ) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex justify-end gap-sm">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
                <button type="submit" disabled={saving} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {editItem ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-sm p-lg">
            <h3 className="text-headline-lg font-semibold mb-md">Xác nhận xóa</h3>
            <p className="text-body-sm text-neutral-text-secondary mb-lg">Xóa khoản thưởng này?</p>
            <div className="flex justify-end gap-sm">
              <button onClick={() => setDeleteId(null)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="rounded bg-error px-md py-sm text-body-sm font-medium text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Penalties Tab ───────────────────────────────────────────
function PenaltiesTab() {
  const [items, setItems] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Penalty | null>(null)
  const [form, setForm] = useState({ name: '', penaltyType: 'LATE', amount: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const PENALTY_TYPES = [
    { value: 'LATE', label: 'Đi trễ' },
    { value: 'ABSENT', label: 'Vắng mặt' },
    { value: 'EARLY_LEAVE', label: 'Về sớm' },
    { value: 'OTHER', label: 'Khác' },
  ]

  const load = async () => {
    try { setLoading(true); const d = await api.salary.penalties(); setItems(d) }
    catch (e) { console.error('Failed to load penalties:', e); setItems([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm({ name: '', penaltyType: 'LATE', amount: '', description: '' }); setShowForm(true) }
  const openEdit = (item: Penalty) => { setEditItem(item); setForm({ name: item.name, penaltyType: item.penaltyType, amount: String(item.amount), description: item.description }); setShowForm(true) }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = { name: form.name, penaltyType: form.penaltyType, amount: Number(form.amount), description: form.description, isActive: true }
      if (editItem) { await api.salary.updatePenalty(editItem.id, payload) }
      else { await api.salary.createPenalty(payload) }
      setShowForm(false); load()
    } catch (e: any) { alert(e.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try { await api.salary.deletePenalty(id); setDeleteId(null); load() } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="space-y-md">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark"><Plus size={16} /> Thêm khoản phạt</button>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center p-xl"><Loader2 className="animate-spin text-primary" /></div> : (
          <table className="data-table">
            <thead><tr><th>TÊN</th><th>LOẠI</th><th>SỐ TIỀN</th><th>MÔ TẢ</th><th>THAO TÁC</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-neutral-text-primary">{item.name}</td>
                  <td><span className="badge-status bg-error-light text-error">{PENALTY_TYPES.find(t => t.value === item.penaltyType)?.label || item.penaltyType}</span></td>
                  <td className="text-neutral-text-secondary">{fmt(item.amount)}</td>
                  <td className="text-neutral-text-secondary">{item.description}</td>
                  <td><div className="flex gap-sm">
                    <button onClick={() => openEdit(item)} className="rounded p-1 hover:bg-neutral-surface hover:text-primary"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="rounded p-1 hover:bg-neutral-surface hover:text-error"><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md p-lg">
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-lg font-semibold">{editItem ? 'Sửa khoản phạt' : 'Thêm khoản phạt mới'}</h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-neutral-surface"><X size={20} /></button>
            </div>
            <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Tên *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Loại phạt *</label>
                  <select value={form.penaltyType} onChange={(e) => setForm({ ...form, penaltyType: e.target.value })} className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none">
                    {PENALTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs font-medium text-neutral-text-secondary">Số tiền (VNĐ) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-label-xs font-medium text-neutral-text-secondary">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex justify-end gap-sm">
                <button type="button" onClick={() => setShowForm(false)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
                <button type="submit" disabled={saving} className="flex items-center gap-sm rounded bg-primary px-md py-sm text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {editItem ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-sm p-lg">
            <h3 className="text-headline-lg font-semibold mb-md">Xác nhận xóa</h3>
            <p className="text-body-sm text-neutral-text-secondary mb-lg">Xóa khoản phạt này?</p>
            <div className="flex justify-end gap-sm">
              <button onClick={() => setDeleteId(null)} className="rounded border border-neutral-border px-md py-sm text-body-sm hover:bg-neutral-surface">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="rounded bg-error px-md py-sm text-body-sm font-medium text-white hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Employee Salary Config Tab (Tick checkbox) ───────────────────────────────────────────
function EmployeeSalaryConfig() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  
  const [activeBonuses, setActiveBonuses] = useState<string[]>([])
  const [activePenalties, setActivePenalties] = useState<string[]>([])
  const [initialBonuses, setInitialBonuses] = useState<string[]>([])
  const [initialPenalties, setInitialPenalties] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<'bonus' | 'penalties'>('bonus')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [empData, bonusData, penaltyData] = await Promise.all([
          api.users.getAll(),
          api.salary.bonus(),
          api.salary.penalties(),
        ])
        setEmployees(empData)
        setBonuses(bonusData)
        setPenalties(penaltyData)
      } catch (e) {
        console.error('Failed to load employee salary config:', e)
        setEmployees([])
        setBonuses([])
        setPenalties([])
      } finally { setLoading(false) }
    }
    loadData()
  }, [])

  const handleSelectEmployee = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value
    setSelectedEmployee(userId)
    if (!userId) {
      setActiveBonuses([])
      setActivePenalties([])
      setInitialBonuses([])
      setInitialPenalties([])
      return
    }

    try {
      setLoadingDetail(true)
      const detail = await api.salary.employeeDetail(userId)
      const bonusIds = detail.bonuses?.map((b: any) => b.id) || []
      const penaltyIds = detail.penalties?.map((p: any) => p.id) || []
      setActiveBonuses(bonusIds)
      setActivePenalties(penaltyIds)
      setInitialBonuses(bonusIds)
      setInitialPenalties(penaltyIds)
    } catch (err) {
      console.error('Failed to load employee details', err)
      setActiveBonuses([])
      setActivePenalties([])
    } finally {
      setLoadingDetail(false)
    }
  }

  const toggleBonus = (bonusId: string) => {
    if (!selectedEmployee) return
    setActiveBonuses(prev => prev.includes(bonusId) ? prev.filter(id => id !== bonusId) : [...prev, bonusId])
  }

  const togglePenalty = (penaltyId: string) => {
    if (!selectedEmployee) return
    setActivePenalties(prev => prev.includes(penaltyId) ? prev.filter(id => id !== penaltyId) : [...prev, penaltyId])
  }

  const handleSave = async () => {
    if (!selectedEmployee) return
    try {
      setSaving(true)
      
      const bonusesToAdd = activeBonuses.filter(id => !initialBonuses.includes(id))
      const bonusesToRemove = initialBonuses.filter(id => !activeBonuses.includes(id))
      const penaltiesToAdd = activePenalties.filter(id => !initialPenalties.includes(id))
      const penaltiesToRemove = initialPenalties.filter(id => !activePenalties.includes(id))

      const promises: Promise<any>[] = []

      bonusesToAdd.forEach(configId => promises.push(api.salary.assignBonus({ userId: selectedEmployee, configId })))
      bonusesToRemove.forEach(configId => promises.push(api.salary.unassignBonus({ userId: selectedEmployee, configId })))
      penaltiesToAdd.forEach(configId => promises.push(api.salary.assignPenalty({ userId: selectedEmployee, configId })))
      penaltiesToRemove.forEach(configId => promises.push(api.salary.unassignPenalty({ userId: selectedEmployee, configId })))

      await Promise.all(promises)

      setInitialBonuses(activeBonuses)
      setInitialPenalties(activePenalties)
      alert('Đã lưu cấu hình thưởng/phạt nhân viên thành công!')
    } catch (e: any) {
      alert(e.message || 'Có lỗi xảy ra khi lưu cấu hình')
    } finally { setSaving(false) }
  }

  const selectedEmp = employees.find(e => e.id === selectedEmployee)

  return (
    <div className="space-y-lg">
      {/* Employee Selector */}
      <div className="card p-lg">
        <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">Chọn nhân viên</h3>
        <select
          value={selectedEmployee}
          onChange={handleSelectEmployee}
          className="w-full rounded-lg border border-neutral-border px-md py-sm text-body-sm focus:border-primary focus:outline-none"
        >
          <option value="">-- Chọn nhân viên --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</option>
          ))}
        </select>
      </div>

      {loadingDetail && (
        <div className="flex justify-center p-xl"><Loader2 className="animate-spin text-primary" size={32} /></div>
      )}

      {selectedEmployee && !loadingDetail && (
        <>
          {/* Employee Info */}
          <div className="card p-lg">
            <div className="flex items-center gap-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-semibold">
                {selectedEmp?.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-headline-lg font-semibold text-neutral-text-primary">{selectedEmp?.fullName}</h3>
                <p className="text-body-sm text-neutral-text-secondary">Mã NV: {selectedEmp?.employeeCode}</p>
              </div>
            </div>
          </div>

          {/* Sub Tabs: Bonus / Penalties */}
          <div className="flex gap-2 border-b border-neutral-border">
            <button
              onClick={() => setActiveSubTab('bonus')}
              className={`border-b-2 px-md py-sm text-body-sm font-medium ${
                activeSubTab === 'bonus' ? 'border-primary text-primary' : 'border-transparent text-neutral-text-muted'
              }`}
            >
              🎁 Thưởng ({activeBonuses.length}/{bonuses.length})
            </button>
            <button
              onClick={() => setActiveSubTab('penalties')}
              className={`border-b-2 px-md py-sm text-body-sm font-medium ${
                activeSubTab === 'penalties' ? 'border-primary text-primary' : 'border-transparent text-neutral-text-muted'
              }`}
            >
              ⚠️ Phạt ({activePenalties.length}/{penalties.length})
            </button>
          </div>

          {/* Bonus Checklist */}
          {activeSubTab === 'bonus' && (
            <div className="card divide-y divide-neutral-border">
              {bonuses.map((bonus) => {
                const isChecked = activeBonuses.includes(bonus.id)
                return (
                  <label key={bonus.id} className="flex items-center gap-md p-md hover:bg-neutral-surface cursor-pointer">
                    <div className={`flex h-6 w-6 items-center justify-center rounded border-2 ${
                      isChecked ? 'border-primary bg-primary' : 'border-neutral-border'
                    }`}>
                      {isChecked && <Check size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBonus(bonus.id)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-neutral-text-primary">{bonus.name}</div>
                      <div className="text-sm text-neutral-text-secondary">{fmt(bonus.amount)}</div>
                    </div>
                    <span className="rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success">
                      +{fmt(bonus.amount)}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Penalties Checklist */}
          {activeSubTab === 'penalties' && (
            <div className="card divide-y divide-neutral-border">
              {penalties.map((penalty) => {
                const isChecked = activePenalties.includes(penalty.id)
                return (
                  <label key={penalty.id} className="flex items-center gap-md p-md hover:bg-neutral-surface cursor-pointer">
                    <div className={`flex h-6 w-6 items-center justify-center rounded border-2 ${
                      isChecked ? 'border-error bg-error' : 'border-neutral-border'
                    }`}>
                      {isChecked && <Check size={14} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePenalty(penalty.id)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-neutral-text-primary">{penalty.name}</div>
                      <div className="text-sm text-neutral-text-secondary">{fmt(penalty.amount)}</div>
                    </div>
                    <span className="rounded-full bg-error-light px-3 py-1 text-xs font-medium text-error">
                      -{fmt(penalty.amount)}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-sm rounded-lg bg-primary px-lg py-3 text-body-base font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Lưu cấu hình
            </button>
          </div>
        </>
      )}

      {!selectedEmployee && (
        <div className="card p-8 text-center text-neutral-text-secondary">
          Vui lòng chọn nhân viên để cấu hình lương
        </div>
      )}
    </div>
  )
}

// ─── Formula Tab ───────────────────────────────────────────
function FormulaTab() {
  const [formula, setFormula] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [salaryVariables, setSalaryVariables] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [bonusData, penaltyData, formulaData] = await Promise.all([
          api.salary.bonus(),
          api.salary.penalties(),
          api.salary.getFormula().catch(() => ({ formula: '{BASE_SALARY} + {TOTAL_BONUS} - {TOTAL_PENALTY}' }))
        ])
        setFormula(formulaData?.formula || '{BASE_SALARY} + {TOTAL_BONUS} - {TOTAL_PENALTY}')
        
        const baseVars = [
          { name: 'Lương cơ bản', code: 'BASE_SALARY', description: 'Mức lương chuẩn theo chức vụ', example: '10,000,000 VNĐ' },
          { name: 'Tổng các khoản thưởng', code: 'TOTAL_BONUS', description: 'Tổng cộng tất cả Thưởng của nhân viên', example: '' },
          { name: 'Tổng các khoản phạt', code: 'TOTAL_PENALTY', description: 'Tổng cộng tất cả Phạt của nhân viên', example: '' },
        ]

        const bonusVars = bonusData.map((b: any) => ({
          name: `[Thưởng] ${b.name}`,
          code: `BONUS_${b.id.replace(/-/g, '_')}`,
          description: b.description || 'Khoản thưởng',
          example: `${b.amount.toLocaleString('vi-VN')} VNĐ`
        }))

        const penaltyVars = penaltyData.map((p: any) => ({
          name: `[Phạt] ${p.name}`,
          code: `PENALTY_${p.id.replace(/-/g, '_')}`,
          description: p.description || 'Khoản phạt',
          example: `${p.amount.toLocaleString('vi-VN')} VNĐ`
        }))

        setSalaryVariables([...baseVars, ...bonusVars, ...penaltyVars])
      } catch (e) {
        console.error('Failed to load formula config:', e)
      } finally { setLoading(false) }
    }
    loadData()
  }, [])

  const insertText = (text: string) => {
    setFormula(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + text + ' ')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.salary.updateFormula(formula)
      alert('Đã lưu công thức tính lương thành công!')
    } catch (e: any) {
      alert(e.message || 'Lỗi khi lưu công thức')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-lg">
      <div className="card p-lg">
        <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">Tạo công thức tùy chỉnh</h3>
        
        <div className="mb-sm flex flex-wrap gap-2">
          {['+', '-', '*', '/', '(', ')'].map(op => (
            <button
              key={op}
              onClick={() => insertText(op)}
              className="flex h-8 w-8 items-center justify-center rounded border border-neutral-border bg-neutral-surface font-mono font-medium hover:bg-neutral-border hover:text-primary transition-colors"
            >
              {op}
            </button>
          ))}
          <div className="h-8 w-px bg-neutral-border mx-2" />
          <button
            onClick={() => setFormula('')}
            className="flex h-8 px-3 items-center justify-center rounded border border-error bg-error/10 text-error text-sm font-medium hover:bg-error hover:text-white transition-colors"
          >
            Xóa trắng
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-md"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <textarea
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-neutral-border px-md py-sm font-mono text-body-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Nhấp vào biến lương bên dưới hoặc nhập thủ công..."
          />
        )}
        <div className="flex justify-between items-center mt-md">
          <p className="text-body-sm text-neutral-text-secondary">
            Mẹo: Bấm vào <code className="text-primary font-mono text-xs font-bold bg-primary/10 px-1 rounded">Mã</code> ở bảng dưới để chèn vào công thức.
          </p>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-sm rounded-lg bg-primary px-md py-2 text-body-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu công thức
          </button>
        </div>
      </div>

      <div className="card p-lg">
        <h3 className="text-headline-lg font-semibold text-neutral-text-primary mb-md">Danh sách Biến lương</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-border">
                <th className="py-3 px-4 text-left font-medium text-neutral-text-secondary w-1/4">Biến</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-text-secondary w-1/4">Mã (Click để chèn)</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-text-secondary w-1/4">Mô tả</th>
                <th className="py-3 px-4 text-left font-medium text-neutral-text-secondary w-1/4">Ví dụ</th>
              </tr>
            </thead>
            <tbody>
              {salaryVariables.map((v, i) => (
                <tr key={i} className="border-b border-neutral-border hover:bg-neutral-surface">
                  <td className="py-3 px-4 font-medium text-neutral-text-primary">{v.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => insertText(`{${v.code}}`)}
                      className="rounded bg-primary/10 px-2 py-1 text-xs font-mono font-bold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                      title="Thêm vào công thức"
                    >
                      <Plus size={12} /> {`{${v.code}}`}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-neutral-text-secondary">{v.description}</td>
                  <td className="py-3 px-4 text-neutral-text-secondary">{v.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
