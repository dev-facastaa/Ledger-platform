import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader } from '../../components/ui/PageHeader'
import { MetricCard } from '../../components/ui/Card'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Input'
import { AlertBadge } from '../../components/ui/Badge'
import { mockDashboardMetrics, mockAlerts } from '../../services/mock/transactions'

const REFRESH_OPTIONS = [
  { value: '15', label: 'Cada 15s' },
  { value: '30', label: 'Cada 30s' },
  { value: '60', label: 'Cada 1 min' },
  { value: '0', label: 'Desactivado' },
]

export function Dashboard() {
  const [refresh, setRefresh] = useState('30')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const metrics = mockDashboardMetrics
  const alerts = mockAlerts

  useEffect(() => {
    if (refresh === '0') return
    const interval = setInterval(() => setLastUpdate(new Date()), parseInt(refresh) * 1000)
    return () => clearInterval(interval)
  }, [refresh])

  const chartData = metrics.hourlyData.map(d => ({
    hora: new Date(d.hour).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    transacciones: d.count,
    errores: d.errors,
  }))

  return (
    <div className="fade-in">
      <PageHeader
        title="Monitoreo"
        breadcrumbs={[{ label: 'Monitoreo' }]}
        actions={
          <div className="flex items-center gap-3">
            <p className="text-xs text-[#6c759f]">
              Actualizado: {lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <Select
              options={REFRESH_OPTIONS}
              value={refresh}
              onChange={e => setRefresh(e.target.value)}
            />
          </div>
        }
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                borderColor: alert.severity === 'critical' ? '#ee424e' : '#ff9800',
                background: alert.severity === 'critical' ? '#fff5f5' : '#fffbf0',
              }}
            >
              <AlertTriangle size={18} color={alert.severity === 'critical' ? '#ee424e' : '#ff9800'} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#121e6c]">{alert.ledgerName}</p>
                <p className="text-xs text-[#6c759f]">{alert.message}</p>
              </div>
              <AlertBadge severity={alert.severity} />
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Transacciones (24h)"
          value={metrics.totalTransactions.toLocaleString('es-CO')}
          sub="Procesadas exitosamente"
          icon={<TrendingUp size={20} />}
          gradient
        />
        <MetricCard
          label="Latencia P50"
          value={`${(metrics.p50LatencyMs / 1000).toFixed(1)}s`}
          sub={`P95: ${(metrics.p95LatencyMs / 1000).toFixed(1)}s | P99: ${(metrics.p99LatencyMs / 1000).toFixed(1)}s`}
          icon={<Clock size={20} />}
        />
        <MetricCard
          label="Tasa de Errores"
          value={`${metrics.errorRate}%`}
          sub="Umbral: 1%"
          icon={<AlertTriangle size={20} />}
        />
        <MetricCard
          label="Ledgers Activos"
          value={3}
          sub="Procesando transacciones"
          icon={<Activity size={20} />}
        />
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <h3 className="text-base font-bold text-[#121e6c] mb-4">Transacciones por hora (últimas 24h)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f2f6" />
            <XAxis
              dataKey="hora"
              tick={{ fontSize: 11, fill: '#6c759f', fontFamily: 'Montserrat' }}
              interval={3}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6c759f', fontFamily: 'Montserrat' }} />
            <Tooltip
              contentStyle={{ border: '1px solid #d2d4e1', borderRadius: 8, fontFamily: 'Montserrat', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Montserrat' }} />
            <Line type="monotone" dataKey="transacciones" stroke="#121e6c" strokeWidth={2} dot={false} name="Transacciones" />
            <Line type="monotone" dataKey="errores" stroke="#ee424e" strokeWidth={2} dot={false} name="Errores" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Volume by Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-bold text-[#121e6c] mb-4">Volumen por Ledger (Top 5)</h3>
          <div className="space-y-3">
            {metrics.volumeByLedger.map((item, i) => {
              const max = metrics.volumeByLedger[0].count
              const pct = max > 0 ? (item.count / max) * 100 : 0
              return (
                <div key={item.ledgerName}>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-semibold text-[#121e6c] truncate">{item.ledgerName}</p>
                    <p className="text-xs text-[#6c759f]">{item.count.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="h-2 rounded-full bg-[#f1f2f6] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: i === 0 ? 'linear-gradient(90deg, #121e6c, #ee424e)' : '#3e4983',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold text-[#121e6c] mb-4">Latencia Detallada</h3>
          <div className="space-y-4">
            {[
              { label: 'Latencia Promedio', value: metrics.avgLatencyMs, color: '#121e6c' },
              { label: 'P50 (Mediana)', value: metrics.p50LatencyMs, color: '#3e4983' },
              { label: 'P95', value: metrics.p95LatencyMs, color: '#ff9800' },
              { label: 'P99', value: metrics.p99LatencyMs, color: '#ee424e' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-[#f1f2f6]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                  <p className="text-sm text-[#6c759f]">{label}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#121e6c]">{(value / 1000).toFixed(2)}s</p>
                  <p className="text-xs text-[#6c759f]">{value.toLocaleString('es-CO')} ms</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
