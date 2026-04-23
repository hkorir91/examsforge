// DiagramRenderer.jsx
// Auto-renders SVG diagrams for Math and Science exam questions
// Math: cylinder, sphere, cone, triangle, circle, coordinate_grid, bearing, number_line, similar_shapes
// Science: animal_cell, plant_cell, microscope, beaker, soil_profile, circuit, human_heart

const S = ({ children, w = 200, h = 200, caption }) => (
  <div className="flex flex-col items-center my-3">
    <div className="border border-gray-300 rounded-lg bg-white p-2 inline-block">
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
        {children}
      </svg>
    </div>
    {caption && (
      <p className="text-xs text-gray-500 mt-1 italic text-center">{caption}</p>
    )}
  </div>
)

const Label = ({ x, y, text, size = 11, color = '#333', anchor = 'middle', italic = false }) => (
  <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor}
    fontStyle={italic ? 'italic' : 'normal'} fontFamily="serif">
    {text}
  </text>
)

const Arrow = ({ x1, y1, x2, y2, color = '#cc0000', dashed = false }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5"
    strokeDasharray={dashed ? '4 2' : 'none'}
    markerEnd="url(#arrowhead)" />
)

// ── Math Diagrams ─────────────────────────────────────────────────────────────

const Cylinder = ({ params = {}, caption }) => (
  <S w={180} h={200} caption={caption}>
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#cc0000" />
      </marker>
    </defs>
    {/* Bottom ellipse */}
    <ellipse cx="80" cy="155" rx="60" ry="18" fill="none" stroke="#1e3a5f" strokeWidth="2" />
    {/* Top ellipse */}
    <ellipse cx="80" cy="45" rx="60" ry="18" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
    {/* Sides */}
    <line x1="20" y1="45" x2="20" y2="155" stroke="#1e3a5f" strokeWidth="2" />
    <line x1="140" y1="45" x2="140" y2="155" stroke="#1e3a5f" strokeWidth="2" />
    {/* Radius line */}
    <line x1="80" y1="45" x2="140" y2="45" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="4 2" />
    <Label x={112} y={40} text={`r = ${params.r || 'r'}`} color="#cc0000" italic />
    {/* Height brace */}
    <line x1="152" y1="45" x2="152" y2="155" stroke="#cc0000" strokeWidth="1.5" />
    <line x1="147" y1="45" x2="157" y2="45" stroke="#cc0000" strokeWidth="1.5" />
    <line x1="147" y1="155" x2="157" y2="155" stroke="#cc0000" strokeWidth="1.5" />
    <Label x={165} y={103} text={`h = ${params.h || 'h'}`} color="#cc0000" italic anchor="start" />
  </S>
)

const Sphere = ({ params = {}, caption }) => (
  <S w={160} h={160} caption={caption}>
    <circle cx="80" cy="80" r="60" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
    <ellipse cx="80" cy="80" rx="60" ry="18" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="5 3" />
    {/* Radius line */}
    <line x1="80" y1="80" x2="140" y2="80" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="4 2" />
    <circle cx="80" cy="80" r="3" fill="#cc0000" />
    <Label x={112} y={73} text={`r = ${params.r || 'r'}`} color="#cc0000" italic />
  </S>
)

const Cone = ({ params = {}, caption }) => (
  <S w={180} h={200} caption={caption}>
    {/* Base ellipse */}
    <ellipse cx="90" cy="155" rx="65" ry="20" fill="none" stroke="#1e3a5f" strokeWidth="2" />
    {/* Sides */}
    <line x1="25" y1="155" x2="90" y2="35" stroke="#1e3a5f" strokeWidth="2" />
    <line x1="155" y1="155" x2="90" y2="35" stroke="#1e3a5f" strokeWidth="2" />
    {/* Radius */}
    <line x1="90" y1="155" x2="155" y2="155" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="4 2" />
    <Label x={125} y={148} text={`r = ${params.r || 'r'}`} color="#cc0000" italic />
    {/* Height */}
    <line x1="90" y1="35" x2="90" y2="155" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="4 2" />
    <Label x={96} y={100} text={`h = ${params.h || 'h'}`} color="#cc0000" italic anchor="start" />
    {/* Apex dot */}
    <circle cx="90" cy="35" r="3" fill="#1e3a5f" />
  </S>
)

const Triangle = ({ params = {}, caption }) => {
  const isRight = params.right
  return (
    <S w={200} h={180} caption={caption}>
      {isRight ? (
        <>
          <polygon points="40,150 160,150 40,40" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
          {/* Right angle box */}
          <polyline points="40,120 70,120 70,150" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
          <Label x={20} y={97} text={params.a || 'a'} color="#cc0000" italic />
          <Label x={100} y={168} text={params.b || 'b'} color="#cc0000" italic />
          <Label x={110} y={100} text={params.c || 'c'} color="#333" italic />
          {params.angle && <Label x={55} y={145} text={params.angle} size={10} color="#1e3a5f" />}
        </>
      ) : (
        <>
          <polygon points="100,25 175,160 25,160" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={100} y={18} text={params.topLabel || 'A'} color="#333" />
          <Label x={14} y={170} text={params.leftLabel || 'B'} color="#333" />
          <Label x={178} y={170} text={params.rightLabel || 'C'} color="#333" />
          {params.sides && <>
            <Label x={50} y={102} text={params.sides[0] || ''} color="#cc0000" italic />
            <Label x={148} y={102} text={params.sides[1] || ''} color="#cc0000" italic />
            <Label x={100} y={172} text={params.sides[2] || ''} color="#cc0000" italic />
          </>}
        </>
      )}
    </S>
  )
}

const CircleDiagram = ({ params = {}, caption }) => (
  <S w={180} h={180} caption={caption}>
    <circle cx="90" cy="90" r="70" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
    {/* Center */}
    <circle cx="90" cy="90" r="3" fill="#1e3a5f" />
    <Label x={93} y={88} text="O" anchor="start" />
    {/* Radius */}
    <line x1="90" y1="90" x2="160" y2="90" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="4 2" />
    <Label x={127} y={83} text={`r = ${params.r || 'r'}`} color="#cc0000" italic />
    {/* Optional chord */}
    {params.chord && (
      <>
        <line x1="30" y1="60" x2="150" y2="130" stroke="#003399" strokeWidth="1.5" />
        <Label x={85} y={55} text="chord" color="#003399" size={10} />
      </>
    )}
    {/* Optional tangent */}
    {params.tangent && (
      <>
        <line x1="160" y1="50" x2="160" y2="135" stroke="#cc0000" strokeWidth="1.5" />
        <line x1="90" y1="90" x2="160" y2="90" stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="3 2" />
        <Label x={164} y={95} text="tangent" color="#cc0000" size={10} anchor="start" />
      </>
    )}
  </S>
)

const CoordinateGrid = ({ params = {}, caption }) => {
  const xMin = params.xMin ?? -4, xMax = params.xMax ?? 4
  const yMin = params.yMin ?? -4, yMax = params.yMax ?? 4
  const scale = 22
  const cx = 110, cy = 110

  const gridLines = []
  for (let i = xMin; i <= xMax; i++) {
    gridLines.push(<line key={`vg${i}`} x1={cx + i * scale} y1={cy + yMin * scale}
      x2={cx + i * scale} y2={cy + yMax * scale} stroke="#e5e7eb" strokeWidth="1" />)
  }
  for (let j = yMin; j <= yMax; j++) {
    gridLines.push(<line key={`hg${j}`} x1={cx + xMin * scale} y1={cy - j * scale}
      x2={cx + xMax * scale} y2={cy - j * scale} stroke="#e5e7eb" strokeWidth="1" />)
  }

  const tickLabels = []
  for (let i = xMin; i <= xMax; i++) {
    if (i !== 0) tickLabels.push(<Label key={`xl${i}`} x={cx + i * scale} y={cy + 16} text={String(i)} size={9} color="#666" />)
  }
  for (let j = yMin; j <= yMax; j++) {
    if (j !== 0) tickLabels.push(<Label key={`yl${j}`} x={cx - 14} y={cy - j * scale + 4} text={String(j)} size={9} color="#666" />)
  }

  const points = (params.points || []).map((p, idx) => (
    <g key={idx}>
      <circle cx={cx + p[0] * scale} cy={cy - p[1] * scale} r="4" fill="#cc0000" />
      {p[2] && <Label x={cx + p[0] * scale + 6} y={cy - p[1] * scale - 4} text={p[2]} color="#cc0000" size={10} anchor="start" />}
    </g>
  ))

  return (
    <S w={220} h={220} caption={caption}>
      {gridLines}
      {/* Axes */}
      <line x1={cx + xMin * scale} y1={cy} x2={cx + xMax * scale} y2={cy} stroke="#1e3a5f" strokeWidth="2" />
      <line x1={cx} y1={cy + yMin * scale} x2={cx} y2={cy + yMax * scale} stroke="#1e3a5f" strokeWidth="2" />
      {/* Axis arrowheads */}
      <polygon points={`${cx + xMax * scale + 8},${cy} ${cx + xMax * scale},${cy - 5} ${cx + xMax * scale},${cy + 5}`} fill="#1e3a5f" />
      <polygon points={`${cx},${cy + yMin * scale - 8} ${cx - 5},${cy + yMin * scale} ${cx + 5},${cy + yMin * scale}`} fill="#1e3a5f" />
      <Label x={cx + xMax * scale + 12} y={cy + 4} text="x" anchor="start" />
      <Label x={cx + 4} y={cy + yMin * scale - 12} text="y" anchor="start" />
      {tickLabels}
      {points}
    </S>
  )
}

const BearingDiagram = ({ params = {}, caption }) => {
  const points = params.points || []
  const cx = 100, cy = 100, r = 70

  return (
    <S w={200} h={200} caption={caption}>
      {/* Compass circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 2" />
      {/* N-S-E-W */}
      <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} stroke="#1e3a5f" strokeWidth="1.5" />
      <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} stroke="#1e3a5f" strokeWidth="1.5" />
      <Label x={cx} y={cy - r - 14} text="N" color="#1e3a5f" size={13} />
      <Label x={cx} y={cy + r + 24} text="S" color="#1e3a5f" size={13} />
      <Label x={cx + r + 14} y={cy + 4} text="E" color="#1e3a5f" size={13} anchor="start" />
      <Label x={cx - r - 14} y={cy + 4} text="W" color="#1e3a5f" size={13} anchor="end" />
      {/* Reference point */}
      <circle cx={cx} cy={cy} r="4" fill="#1e3a5f" />
      {/* Bearing lines */}
      {points.map((p, i) => {
        const rad = (p.bearing - 90) * Math.PI / 180
        const ex = cx + Math.cos(rad) * (r - 10)
        const ey = cy + Math.sin(rad) * (r - 10)
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#cc0000" strokeWidth="1.5" />
            <circle cx={ex} cy={ey} r="4" fill="#cc0000" />
            <Label x={ex + (ex > cx ? 6 : -6)} y={ey} text={p.label || `P${i + 1}`} color="#cc0000" size={10} anchor={ex > cx ? 'start' : 'end'} />
          </g>
        )
      })}
    </S>
  )
}

const NumberLine = ({ params = {}, caption }) => {
  const min = params.min ?? -5, max = params.max ?? 5
  const scale = 25
  const cy = 80, cx0 = 30

  const ticks = []
  for (let i = min; i <= max; i++) {
    ticks.push(
      <g key={i}>
        <line x1={cx0 + (i - min) * scale} y1={cy - 8} x2={cx0 + (i - min) * scale} y2={cy + 8} stroke="#1e3a5f" strokeWidth="1.5" />
        <Label x={cx0 + (i - min) * scale} y={cy + 22} text={String(i)} size={10} color="#333" />
      </g>
    )
  }

  const marked = (params.marked || []).map((m, i) => (
    <circle key={i} cx={cx0 + (m - min) * scale} cy={cy}
      r="6" fill={params.open?.[i] ? 'white' : '#cc0000'}
      stroke="#cc0000" strokeWidth="2" />
  ))

  return (
    <S w={(max - min) * scale + 60} h={120} caption={caption}>
      <line x1={cx0 - 10} y1={cy} x2={cx0 + (max - min) * scale + 10} y2={cy} stroke="#1e3a5f" strokeWidth="2" />
      {ticks}
      {marked}
    </S>
  )
}

const SimilarShapes = ({ params = {}, caption }) => (
  <S w={220} h={140} caption={caption}>
    {/* Shape 1 */}
    <rect x="15" y="30" width="60" height="80" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
    <Label x={45} y={22} text={params.label1 || 'Shape 1'} size={10} color="#333" />
    <Label x={8} y={72} text={params.h1 || 'h'} color="#cc0000" italic size={10} />
    <Label x={45} y={120} text={params.w1 || 'w'} color="#cc0000" italic size={10} />
    {/* Shape 2 — scaled */}
    <rect x="120" y="50" width="90" height="60" fill="#e8f0fe" stroke="#1e3a5f" strokeWidth="2" />
    <Label x={165} y={42} text={params.label2 || 'Shape 2'} size={10} color="#333" />
    <Label x={113} y={82} text={params.h2 || 'H'} color="#cc0000" italic size={10} />
    <Label x={165} y={120} text={params.w2 || 'W'} color="#cc0000" italic size={10} />
  </S>
)

// ── Science Diagrams ──────────────────────────────────────────────────────────

const AnimalCell = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 100, y: 45 },
    { label: 'B', x: 145, y: 90 },
    { label: 'C', x: 100, y: 120 },
    { label: 'D', x: 60, y: 85 },
  ]
  return (
    <S w={220} h={200} caption={caption}>
      {/* Cell membrane */}
      <ellipse cx="110" cy="100" rx="95" ry="80" fill="#fef3c7" stroke="#1e3a5f" strokeWidth="2" />
      {/* Nucleus */}
      <ellipse cx="110" cy="95" rx="35" ry="28" fill="#bfdbfe" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Nucleolus */}
      <ellipse cx="110" cy="93" rx="12" ry="9" fill="#3b82f6" stroke="#1e3a5f" strokeWidth="1" />
      {/* Mitochondria */}
      <ellipse cx="55" cy="70" rx="16" ry="9" fill="#d1fae5" stroke="#1e3a5f" strokeWidth="1.5" />
      <ellipse cx="170" cy="120" rx="16" ry="9" fill="#d1fae5" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Vacuole */}
      <ellipse cx="75" cy="130" rx="14" ry="10" fill="#e0f2fe" stroke="#1e3a5f" strokeWidth="1" />
      {/* Labels with leader lines */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -25 : 25)} y2={p.y - 15}
            stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -48 : 25)} y={p.y - 25} width="22" height="16"
            fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -37 : 36)} y={p.y - 13}
            text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

const PlantCell = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 110, y: 22 },
    { label: 'B', x: 175, y: 90 },
    { label: 'C', x: 110, y: 105 },
    { label: 'D', x: 50, y: 90 },
  ]
  return (
    <S w={220} h={200} caption={caption}>
      {/* Cell wall */}
      <rect x="12" y="12" width="196" height="176" fill="none" stroke="#1e3a5f" strokeWidth="3" rx="4" />
      {/* Cell membrane */}
      <rect x="18" y="18" width="184" height="164" fill="#fef3c7" stroke="#1e3a5f" strokeWidth="1.5" rx="3" />
      {/* Chloroplasts */}
      <ellipse cx="60" cy="55" rx="18" ry="10" fill="#86efac" stroke="#1e3a5f" strokeWidth="1.5" />
      <ellipse cx="155" cy="145" rx="18" ry="10" fill="#86efac" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Large vacuole */}
      <ellipse cx="110" cy="100" rx="38" ry="32" fill="#e0f2fe" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Nucleus */}
      <ellipse cx="75" cy="130" rx="22" ry="18" fill="#bfdbfe" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -20 : 20)} y2={p.y}
            stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -42 : 20)} y={p.y - 8} width="22" height="16"
            fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -31 : 31)} y={p.y + 4}
            text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

const Microscope = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 100, y: 15, part: 'eyepiece' },
    { label: 'B', x: 100, y: 60, part: 'body tube' },
    { label: 'C', x: 100, y: 105, part: 'objective lens' },
    { label: 'D', x: 100, y: 145, part: 'stage' },
  ]
  return (
    <S w={220} h={220} caption={caption}>
      {/* Eyepiece */}
      <rect x="88" y="8" width="24" height="35" rx="4" fill="#e2e8f0" stroke="#1e3a5f" strokeWidth="2" />
      {/* Body tube */}
      <rect x="90" y="43" width="20" height="55" fill="#cbd5e1" stroke="#1e3a5f" strokeWidth="2" />
      {/* Arm */}
      <path d="M100 98 Q70 110 70 160" fill="none" stroke="#1e3a5f" strokeWidth="8" strokeLinecap="round" />
      {/* Nosepiece */}
      <ellipse cx="100" cy="99" rx="18" ry="8" fill="#94a3b8" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Objective lenses */}
      <line x1="95" y1="107" x2="88" y2="125" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <line x1="105" y1="107" x2="112" y2="125" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" />
      {/* Stage */}
      <rect x="50" y="148" width="100" height="12" rx="2" fill="#94a3b8" stroke="#1e3a5f" strokeWidth="2" />
      {/* Stage clips */}
      <rect x="70" y="145" width="10" height="18" rx="1" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
      <rect x="120" y="145" width="10" height="18" rx="1" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Base */}
      <rect x="45" y="195" width="110" height="18" rx="4" fill="#475569" stroke="#1e3a5f" strokeWidth="2" />
      {/* Pillar */}
      <rect x="65" y="160" width="10" height="35" fill="#64748b" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x < 100 ? p.x - 5 : p.x + 5} y1={p.y}
            x2={p.x < 100 ? p.x - 30 : p.x + 30} y2={p.y}
            stroke="#666" strokeWidth="1" />
          <rect x={p.x < 100 ? p.x - 52 : p.x + 30} y={p.y - 8}
            width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x < 100 ? p.x - 41 : p.x + 41} y={p.y + 4}
            text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

const Beaker = ({ params = {}, caption }) => (
  <S w={160} h={180} caption={caption}>
    {/* Beaker body */}
    <path d="M40,30 L40,150 Q40,165 55,165 L105,165 Q120,165 120,150 L120,30 Z"
      fill="#e0f2fe" stroke="#1e3a5f" strokeWidth="2" />
    {/* Liquid level */}
    {params.liquid && (
      <path d={`M42,${130 - (params.level || 50)} L118,${130 - (params.level || 50)} L118,150 Q118,162 105,162 L55,162 Q42,162 42,150 Z`}
        fill="#bfdbfe" stroke="none" />
    )}
    {/* Spout */}
    <path d="M40,30 L35,20 M120,30 L125,20" fill="none" stroke="#1e3a5f" strokeWidth="2" />
    {/* Rim */}
    <line x1="35" y1="30" x2="125" y2="30" stroke="#1e3a5f" strokeWidth="2" />
    {/* Graduation marks */}
    {[40, 60, 80, 100, 120].map((y, i) => (
      <g key={i}>
        <line x1="40" y1={y + 30} x2="50" y2={y + 30} stroke="#1e3a5f" strokeWidth="1" />
        <Label x={52} y={y + 34} text={`${(5 - i) * 20}ml`} size={9} color="#666" anchor="start" />
      </g>
    ))}
    {/* Label */}
    {params.label && <Label x={80} y={100} text={params.label} size={11} color="#1e3a5f" />}
  </S>
)

const SoilProfile = ({ params = {}, caption }) => {
  const layers = params.layers || [
    { name: 'O — Organic layer', color: '#78350f', h: 30 },
    { name: 'A — Topsoil', color: '#92400e', h: 40 },
    { name: 'B — Subsoil', color: '#b45309', h: 45 },
    { name: 'C — Parent material', color: '#d97706', h: 40 },
    { name: 'R — Bedrock', color: '#6b7280', h: 30 },
  ]
  let yOff = 15
  return (
    <S w={220} h={220} caption={caption}>
      {layers.map((l, i) => {
        const y = yOff
        yOff += l.h
        return (
          <g key={i}>
            <rect x="15" y={y} width="90" height={l.h} fill={l.color} stroke="#1e3a5f" strokeWidth="1" fillOpacity="0.7" />
            <line x1="105" y1={y + l.h / 2} x2="125" y2={y + l.h / 2} stroke="#666" strokeWidth="1" />
            <Label x={127} y={y + l.h / 2 + 4} text={l.name} size={9} color="#333" anchor="start" />
          </g>
        )
      })}
    </S>
  )
}

const BasicCircuit = ({ params = {}, caption }) => (
  <S w={220} h={160} caption={caption}>
    {/* Wire outline */}
    <rect x="30" y="30" width="160" height="100" fill="none" stroke="#1e3a5f" strokeWidth="2" />
    {/* Battery */}
    <line x1="30" y1="65" x2="30" y2="95" stroke="#1e3a5f" strokeWidth="4" />
    <line x1="20" y1="72" x2="40" y2="72" stroke="#1e3a5f" strokeWidth="2" />
    <line x1="23" y1="80" x2="37" y2="80" stroke="#1e3a5f" strokeWidth="3" />
    <line x1="20" y1="88" x2="40" y2="88" stroke="#1e3a5f" strokeWidth="2" />
    <Label x={30} y={107} text="Cell" size={9} color="#333" />
    {/* Bulb/resistor */}
    <circle cx="110" cy="30" r="12" fill="#fef9c3" stroke="#1e3a5f" strokeWidth="2" />
    <line x1="103" y1="37" x2="117" y2="23" stroke="#1e3a5f" strokeWidth="1.5" />
    <line x1="117" y1="37" x2="103" y2="23" stroke="#1e3a5f" strokeWidth="1.5" />
    <Label x={110} y={16} text="Bulb" size={9} color="#333" />
    {/* Switch */}
    <circle cx="190" cy="80" r="4" fill="#1e3a5f" />
    <circle cx="190" cy="60" r="4" fill="#1e3a5f" />
    <line x1="190" y1="60" x2="185" y2="76" stroke="#1e3a5f" strokeWidth="2" />
    <Label x={198} y={72} text="Switch" size={9} color="#333" anchor="start" />
    {/* Arrows showing current */}
    <polygon points="110,130 105,140 115,140" fill="#cc0000" />
    <Label x={120} y={142} text="I" color="#cc0000" italic size={11} anchor="start" />
  </S>
)

const HumanHeart = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 80, y: 45 },
    { label: 'B', x: 145, y: 60 },
    { label: 'C', x: 75, y: 110 },
    { label: 'D', x: 140, y: 110 },
  ]
  return (
    <S w={220} h={200} caption={caption}>
      {/* Heart shape */}
      <path d="M110,170 C70,140 20,110 20,70 C20,45 40,30 60,30 C80,30 95,42 110,55 C125,42 140,30 160,30 C180,30 200,45 200,70 C200,110 150,140 110,170 Z"
        fill="#fecaca" stroke="#1e3a5f" strokeWidth="2" />
      {/* Septum */}
      <line x1="110" y1="55" x2="110" y2="150" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="5 3" />
      {/* Valves */}
      <ellipse cx="80" cy="90" rx="20" ry="8" fill="#fca5a5" stroke="#1e3a5f" strokeWidth="1.5" />
      <ellipse cx="140" cy="90" rx="20" ry="8" fill="#fca5a5" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Aorta */}
      <path d="M110,55 L110,20 L130,20" fill="none" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
      {/* Pulmonary artery */}
      <path d="M110,55 L90,20" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -25 : 25)} y2={p.y - 10}
            stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -46 : 25)} y={p.y - 20}
            width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -35 : 36)} y={p.y - 8}
            text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

// ── Generic Labeled Placeholder ───────────────────────────────────────────────
const GenericDiagram = ({ params = {}, caption }) => (
  <S w={200} h={150} caption={caption}>
    <rect x="10" y="10" width="180" height="120" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 3" />
    <Label x={100} y={65} text={params.description || 'Diagram'} size={12} color="#94a3b8" />
    <Label x={100} y={85} text="[See question text]" size={10} color="#cbd5e1" />
  </S>
)

// ── Main Export ───────────────────────────────────────────────────────────────
export default function DiagramRenderer({ diagram }) {
  if (!diagram || !diagram.type) return null

  const { type, params, caption, labelledParts } = diagram
  const p = { ...params, labelledParts }

  const components = {
    // Math
    cylinder: Cylinder,
    sphere: Sphere,
    cone: Cone,
    triangle: Triangle,
    right_triangle: (props) => <Triangle {...props} params={{ ...props.params, right: true }} />,
    circle: CircleDiagram,
    coordinate_grid: CoordinateGrid,
    bearing: BearingDiagram,
    number_line: NumberLine,
    similar_shapes: SimilarShapes,
    // Science
    animal_cell: AnimalCell,
    plant_cell: PlantCell,
    microscope: Microscope,
    beaker: Beaker,
    soil_profile: SoilProfile,
    circuit: BasicCircuit,
    human_heart: HumanHeart,
  }

  const Component = components[type] || GenericDiagram
  return <Component params={p} caption={caption} />
}
