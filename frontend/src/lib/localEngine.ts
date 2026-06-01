export class TrafficAnalyticsEngine {
  static ROAD_CAPACITY_DEFAULT = 100
  static MAX_SPEED_KMH = 80

  calculateDensity(vc: number, cap?: number) {
    const c = cap || TrafficAnalyticsEngine.ROAD_CAPACITY_DEFAULT
    return Math.round(Math.min(100, Math.max(0, (vc / c) * 100)) * 10) / 10
  }

  calculateCongestionScore(vc: number, sp: number, lo: number) {
    const vf = Math.min(1, vc / 1000)
    const sf = Math.max(0, 1 - sp / TrafficAnalyticsEngine.MAX_SPEED_KMH)
    const lf = Math.min(1, lo / 100)
    return Math.round(Math.min(100, Math.max(0, vf * 35 + sf * 40 + lf * 25)) * 10) / 10
  }

  getCongestionLevel(s: number) {
    if (s < 15) return 'very_low'
    if (s < 30) return 'low'
    if (s < 50) return 'moderate'
    if (s < 70) return 'high'
    return 'critical'
  }

  calculateRiskScore(vc: number, sp: number, lo: number, emergency = false, accident = false, weather = 'clear') {
    const density = this.calculateDensity(vc)
    const sf = Math.max(0, 1 - sp / 80)
    const of = lo / 100
    let base = density * 0.3 + sf * 40 + of * 30
    if (emergency) base += 15
    if (accident) base += 20
    const wm: Record<string, number> = { clear: 0, rain: 10, fog: 15, storm: 25 }
    base += wm[weather] || 0
    return Math.round(Math.min(100, Math.max(0, base)))
  }

  calculateFlowEfficiency(sp: number, lo: number) {
    const sr = Math.min(1, sp / 45)
    const op = Math.max(0, lo - 30) / 70
    return Math.round(Math.min(100, Math.max(0, (sr * 0.6 + (1 - op) * 0.4) * 100)))
  }

  generatePredictions(vc: number, sp: number, lo: number) {
    const cs = this.calculateCongestionScore(vc, sp, lo)
    const preds: Record<string, any> = {}
    for (const m of [15, 30, 60]) {
      const wave = Math.sin(m / 60 * Math.PI) * 5
      const trend = (vc / 800) * 8
      const pcs = Math.max(0, Math.min(100, cs + wave + trend * (m / 60)))
      const pvc = Math.round(vc * (1 + (m / 60) * 0.05))
      const psp = Math.max(5, sp - (m / 60) * 3)
      const conf = Math.max(50, Math.min(98, 95 - m * 0.3 - (pcs - 50) * 0.1))
      preds[`${m}min`] = {
        predicted_vehicles: pvc,
        predicted_speed: Math.round(psp * 10) / 10,
        predicted_congestion: Math.round(pcs * 10) / 10,
        predicted_level: this.getCongestionLevel(pcs),
        confidence: Math.round(conf * 10) / 10,
      }
    }
    return preds
  }

  generateRecommendations(vc: number, sp: number, lo: number, emergency = false, accident = false) {
    const cs = this.calculateCongestionScore(vc, sp, lo)
    const level = this.getCongestionLevel(cs)
    const density = this.calculateDensity(vc)
    const recs: any[] = []

    if (['high', 'critical'].includes(level)) {
      recs.push({ priority: level === 'critical' ? 'CRITICAL' : 'HIGH', action: `Deploy traffic management team - ${level.toUpperCase()} congestion detected with ${vc} vehicles at ${sp} km/h`, reason: `Vehicle density at ${density}% with lane occupancy ${lo}% exceeds safe threshold of 70%`, expected_impact: '15-25% improvement in traffic flow' })
      if (sp < 15) recs.push({ priority: 'CRITICAL', action: 'Implement hold-and-release signal pattern at all upstream junctions', reason: `Average speed ${sp} km/h indicates gridlock conditions forming`, expected_impact: 'Prevent complete gridlock, reduce queue spillback' })
      recs.push({ priority: 'HIGH', action: 'Activate dynamic message signs advising alternate routes', reason: `Current congestion score ${cs}/100 exceeds threshold for normal operation`, expected_impact: 'Divert 20-30% traffic to alternate corridors' })
    } else if (level === 'moderate') {
      recs.push({ priority: 'MEDIUM', action: 'Adjust signal timing splits for 10% longer green on main corridor', reason: `Moderate congestion (${cs}) with ${vc} vehicles - proactive signal tuning can prevent escalation`, expected_impact: 'Prevent 15% congestion increase in next 30 minutes' })
    } else {
      recs.push({ priority: 'INFO', action: 'Continue normal traffic management operations', reason: `Traffic flowing well at ${sp} km/h with ${vc} vehicles`, expected_impact: 'Maintain current smooth flow conditions' })
    }
    if (accident) recs.unshift({ priority: 'CRITICAL', action: 'Dispatch emergency services and establish incident command post', reason: `Active accident with ${vc} vehicles accumulating at accident zone`, expected_impact: 'Rapid incident clearance, reduce secondary accident risk' })
    if (emergency) recs.unshift({ priority: 'CRITICAL', action: 'Activate green corridor for emergency vehicle passage', reason: `Emergency vehicle requires priority routing through congestion level ${level}`, expected_impact: '40-60% reduction in emergency response time' })
    return recs
  }

  generateReasoning(vc: number, sp: number, lo: number, emergency = false, accident = false, weather = 'clear', roadCapacity?: number) {
    const density = this.calculateDensity(vc, roadCapacity)
    const cs = this.calculateCongestionScore(vc, sp, lo)
    const level = this.getCongestionLevel(cs)
    const risk = this.calculateRiskScore(vc, sp, lo, emergency, accident, weather)
    const efficiency = this.calculateFlowEfficiency(sp, lo)
    const predictions = this.generatePredictions(vc, sp, lo)
    const recs = this.generateRecommendations(vc, sp, lo, emergency, accident)
    const factors: string[] = []

    if (density > 70) factors.push(`Vehicle density (${density}%) exceeds optimal threshold of 70%`)
    else if (density > 50) factors.push(`Vehicle density (${density}%) approaching critical threshold`)
    if (sp < 15) factors.push(`Average speed (${sp} km/h) significantly below normal urban traffic speed of 35-45 km/h`)
    else if (sp < 30) factors.push(`Average speed (${sp} km/h) indicates building congestion conditions`)
    else factors.push(`Average speed (${sp} km/h) within acceptable range`)
    if (lo > 80) factors.push(`Lane occupancy (${lo}%) indicates saturation - over 80% triggers gridlock risk`)
    else if (lo > 60) factors.push(`Lane occupancy (${lo}%) at elevated level, monitoring required`)
    if (accident) factors.push('Active accident incident detected - contributing 20 points to risk score')
    if (emergency) factors.push('Emergency vehicle active - priority routing engaged')

    const ts = level.toUpperCase()
    const label = level === 'critical' ? 'CRITICAL - Immediate intervention required'
      : level === 'high' ? 'HIGH - Active traffic management needed'
      : level === 'moderate' ? 'MODERATE - Monitoring advised'
      : 'NORMAL - Traffic flowing smoothly'

    return {
      traffic_status: ts,
      traffic_status_label: label,
      congestion_score: cs,
      congestion_level: level,
      vehicle_density: density,
      risk_score: risk,
      flow_efficiency: efficiency,
      factors,
      predictions,
      recommendations: recs,
      explanation: `Traffic Status: ${label}\n\nReason:\n${factors.slice(0, 3).map(f => `• ${f}`).join('\n')}\n\nRisk Score: ${risk}/100\n\nPrediction: Traffic congestion predicted to trend ${predictions['30min']?.predicted_congestion > cs ? 'upward' : 'downward'}. In 30 minutes, congestion score estimated at ${predictions['30min']?.predicted_congestion || '?'}/100 (${predictions['30min']?.predicted_level || '?'}) with ${predictions['30min']?.confidence || '?'}% confidence.\n\nRecommendations:\n${recs.slice(0, 3).map(r => `• [${r.priority}] ${r.action}`).join('\n')}`,
    }
  }
}
