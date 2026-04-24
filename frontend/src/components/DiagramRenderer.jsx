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

// ── NEW DIAGRAM TYPES ─────────────────────────────────────────────────────────

// MATH: Bar Chart
const BarChart = ({ params = {}, caption }) => {
  const bars = params.bars || [
    { label: 'A', value: 40 },
    { label: 'B', value: 65 },
    { label: 'C', value: 30 },
    { label: 'D', value: 55 },
    { label: 'E', value: 75 },
  ]
  const maxVal = Math.max(...bars.map(b => b.value), 1)
  const chartH = 120, chartW = 160, ox = 35, oy = 145
  const barW = Math.min(28, chartW / bars.length - 6)
  const gap = (chartW - bars.length * barW) / (bars.length + 1)

  return (
    <S w={220} h={185} caption={caption}>
      {/* Y-axis */}
      <line x1={ox} y1={oy - chartH} x2={ox} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      {/* X-axis */}
      <line x1={ox} y1={oy} x2={ox + chartW} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      {/* Y gridlines + labels */}
      {[0, 25, 50, 75, 100].map(v => {
        const y = oy - (v / maxVal) * chartH
        return (
          <g key={v}>
            <line x1={ox - 4} y1={y} x2={ox + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <Label x={ox - 6} y={y + 4} text={String(v)} size={8} color="#666" anchor="end" />
          </g>
        )
      })}
      {/* Bars */}
      {bars.map((b, i) => {
        const bh = (b.value / maxVal) * chartH
        const bx = ox + gap + i * (barW + gap)
        return (
          <g key={i}>
            <rect x={bx} y={oy - bh} width={barW} height={bh} fill="#3b82f6" fillOpacity="0.8" stroke="#1e3a5f" strokeWidth="1" />
            <Label x={bx + barW / 2} y={oy + 14} text={b.label} size={9} color="#333" />
            <Label x={bx + barW / 2} y={oy - bh - 4} text={String(b.value)} size={8} color="#1e3a5f" />
          </g>
        )
      })}
      {/* Axis labels */}
      {params.xLabel && <Label x={ox + chartW / 2} y={oy + 28} text={params.xLabel} size={9} color="#333" />}
      {params.yLabel && <Label x={12} y={oy - chartH / 2} text={params.yLabel} size={9} color="#333" />}
    </S>
  )
}

// MATH: Pie Chart
const PieChart = ({ params = {}, caption }) => {
  const slices = params.slices || [
    { label: 'A', value: 30, color: '#3b82f6' },
    { label: 'B', value: 25, color: '#ef4444' },
    { label: 'C', value: 20, color: '#10b981' },
    { label: 'D', value: 15, color: '#f59e0b' },
    { label: 'E', value: 10, color: '#8b5cf6' },
  ]
  const total = slices.reduce((s, x) => s + x.value, 0)
  const cx = 100, cy = 100, r = 70
  let startAngle = -Math.PI / 2

  return (
    <S w={220} h={200} caption={caption}>
      {slices.map((sl, i) => {
        const angle = (sl.value / total) * 2 * Math.PI
        const endAngle = startAngle + angle
        const mx = cx + Math.cos(startAngle + angle / 2) * (r * 0.65)
        const my = cy + Math.sin(startAngle + angle / 2) * (r * 0.65)
        const lx = cx + Math.cos(startAngle + angle / 2) * (r + 22)
        const ly = cy + Math.sin(startAngle + angle / 2) * (r + 22)
        const x1 = cx + Math.cos(startAngle) * r
        const y1 = cy + Math.sin(startAngle) * r
        const x2 = cx + Math.cos(endAngle) * r
        const y2 = cy + Math.sin(endAngle) * r
        const largeArc = angle > Math.PI ? 1 : 0
        const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
        startAngle = endAngle
        return (
          <g key={i}>
            <path d={d} fill={sl.color || '#3b82f6'} fillOpacity="0.85" stroke="white" strokeWidth="1.5" />
            <Label x={mx} y={my} text={`${Math.round(sl.value / total * 100)}%`} size={9} color="white" />
            <Label x={lx} y={ly} text={sl.label} size={9} color="#333" />
          </g>
        )
      })}
    </S>
  )
}

// MATH: Histogram
const Histogram = ({ params = {}, caption }) => {
  const bars = params.bars || [
    { lower: 0, upper: 10, freq: 5 },
    { lower: 10, upper: 20, freq: 12 },
    { lower: 20, upper: 30, freq: 18 },
    { lower: 30, upper: 40, freq: 8 },
    { lower: 40, upper: 50, freq: 3 },
  ]
  const maxFreq = Math.max(...bars.map(b => b.freq), 1)
  const chartH = 120, ox = 35, oy = 155
  const totalRange = bars[bars.length - 1].upper - bars[0].lower
  const chartW = 165

  return (
    <S w={220} h={195} caption={caption}>
      <line x1={ox} y1={oy - chartH} x2={ox} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      <line x1={ox} y1={oy} x2={ox + chartW} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      {[0, 5, 10, 15, 20].map(v => {
        const y = oy - (v / maxFreq) * chartH
        return (
          <g key={v}>
            <line x1={ox - 3} y1={y} x2={ox + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <Label x={ox - 5} y={y + 4} text={String(v)} size={8} color="#666" anchor="end" />
          </g>
        )
      })}
      {bars.map((b, i) => {
        const bh = (b.freq / maxFreq) * chartH
        const bx = ox + ((b.lower - bars[0].lower) / totalRange) * chartW
        const bw = ((b.upper - b.lower) / totalRange) * chartW
        return (
          <g key={i}>
            <rect x={bx} y={oy - bh} width={bw} height={bh} fill="#6366f1" fillOpacity="0.75" stroke="#1e3a5f" strokeWidth="1" />
            <Label x={bx + bw / 2} y={oy + 13} text={String(b.lower)} size={8} color="#333" />
          </g>
        )
      })}
      <Label x={ox + chartW + 5} y={oy + 13} text={String(bars[bars.length - 1].upper)} size={8} color="#333" anchor="start" />
      {params.xLabel && <Label x={ox + chartW / 2} y={oy + 26} text={params.xLabel} size={9} color="#333" />}
      <Label x={12} y={oy - chartH / 2} text="Freq" size={9} color="#333" />
    </S>
  )
}

// MATH: Venn Diagram (2 sets)
const VennDiagram = ({ params = {}, caption }) => {
  const setA = params.setA || 'A'
  const setB = params.setB || 'B'
  const onlyA = params.onlyA || ''
  const onlyB = params.onlyB || ''
  const both = params.both || ''
  const outside = params.outside || ''

  return (
    <S w={240} h={180} caption={caption}>
      {/* Rectangle universe */}
      <rect x="8" y="8" width="224" height="164" fill="none" stroke="#1e3a5f" strokeWidth="1.5" rx="4" />
      {/* Circle A */}
      <circle cx="90" cy="90" r="62" fill="#bfdbfe" fillOpacity="0.5" stroke="#1e3a5f" strokeWidth="2" />
      {/* Circle B */}
      <circle cx="150" cy="90" r="62" fill="#fde68a" fillOpacity="0.5" stroke="#1e3a5f" strokeWidth="2" />
      {/* Labels */}
      <Label x={55} y={35} text={setA} size={13} color="#1e3a5f" />
      <Label x={185} y={35} text={setB} size={13} color="#1e3a5f" />
      {onlyA && <Label x={68} y={95} text={onlyA} size={11} color="#1e40af" />}
      {both && <Label x={120} y={95} text={both} size={11} color="#065f46" />}
      {onlyB && <Label x={172} y={95} text={onlyB} size={11} color="#92400e" />}
      {outside && <Label x={18} y={168} text={outside} size={9} color="#666" anchor="start" />}
    </S>
  )
}

// MATH: Line Graph
const LineGraph = ({ params = {}, caption }) => {
  const points = params.points || [[0,0],[1,2],[2,5],[3,4],[4,7],[5,9]]
  const xMin = Math.min(...points.map(p => p[0]))
  const xMax = Math.max(...points.map(p => p[0]))
  const yMin = 0
  const yMax = Math.max(...points.map(p => p[1]))
  const ox = 40, oy = 155, chartW = 160, chartH = 120
  const toX = x => ox + ((x - xMin) / (xMax - xMin || 1)) * chartW
  const toY = y => oy - ((y - yMin) / (yMax - yMin || 1)) * chartH

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p[0])},${toY(p[1])}`).join(' ')

  return (
    <S w={220} h={190} caption={caption}>
      <line x1={ox} y1={oy - chartH} x2={ox} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      <line x1={ox} y1={oy} x2={ox + chartW} y2={oy} stroke="#1e3a5f" strokeWidth="2" />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = oy - t * chartH
        const val = Math.round(yMin + t * (yMax - yMin))
        return <g key={i}>
          <line x1={ox - 3} y1={y} x2={ox + chartW} y2={y} stroke="#e5e7eb" strokeWidth="1" />
          <Label x={ox - 5} y={y + 4} text={String(val)} size={8} color="#666" anchor="end" />
        </g>
      })}
      {points.map((p, i) => (
        <Label key={i} x={toX(p[0])} y={oy + 13} text={String(p[0])} size={8} color="#333" />
      ))}
      <path d={pathD} fill="none" stroke="#cc0000" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={toX(p[0])} cy={toY(p[1])} r="3.5" fill="#cc0000" />
      ))}
      {params.xLabel && <Label x={ox + chartW / 2} y={oy + 26} text={params.xLabel} size={9} color="#333" />}
      {params.yLabel && <Label x={14} y={oy - chartH / 2} text={params.yLabel} size={9} color="#333" />}
    </S>
  )
}

// BIOLOGY: Human Digestive System
const DigestiveSystem = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 110, y: 30 },
    { label: 'B', x: 110, y: 65 },
    { label: 'C', x: 110, y: 105 },
    { label: 'D', x: 95, y: 140 },
    { label: 'E', x: 110, y: 175 },
  ]
  return (
    <S w={220} h={230} caption={caption}>
      {/* Mouth */}
      <ellipse cx="110" cy="22" rx="22" ry="10" fill="#fecaca" stroke="#1e3a5f" strokeWidth="1.5" />
      <Label x={110} y={25} text="mouth" size={8} color="#1e3a5f" />
      {/* Oesophagus */}
      <rect x="104" y="32" width="12" height="28" fill="#fed7aa" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Stomach */}
      <path d="M90,60 Q75,75 80,95 Q85,115 110,115 Q130,115 130,95 Q132,72 120,60 Z" fill="#fef08a" stroke="#1e3a5f" strokeWidth="2" />
      {/* Small intestine — coiled */}
      <path d="M110,115 Q140,118 140,130 Q140,145 110,148 Q80,151 80,163 Q80,175 110,178" fill="none" stroke="#86efac" strokeWidth="6" strokeLinecap="round" />
      {/* Large intestine */}
      <path d="M110,178 Q130,178 135,165 Q140,145 140,130" fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
      {/* Rectum */}
      <rect x="105" y="178" width="10" height="25" fill="#fb923c" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Liver */}
      <ellipse cx="75" cy="80" rx="18" ry="12" fill="#c084fc" fillOpacity="0.7" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -28 : 28)} y2={p.y} stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -50 : 28)} y={p.y - 8} width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -39 : 39)} y={p.y + 4} text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

// BIOLOGY: Respiratory System
const RespiratorySystem = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 110, y: 25 },
    { label: 'B', x: 110, y: 60 },
    { label: 'C', x: 80, y: 100 },
    { label: 'D', x: 140, y: 100 },
  ]
  return (
    <S w={220} h={210} caption={caption}>
      {/* Nasal cavity */}
      <path d="M95,15 Q110,8 125,15 Q130,25 120,32 Q110,38 100,32 Q90,25 95,15 Z" fill="#fecdd3" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Trachea */}
      <rect x="104" y="35" width="12" height="40" fill="#e0f2fe" stroke="#1e3a5f" strokeWidth="1.5" />
      {[45,55,65].map(y => <line key={y} x1="106" y1={y} x2="114" y2={y} stroke="#1e3a5f" strokeWidth="1" />)}
      {/* Bronchi */}
      <path d="M110,75 Q90,80 80,90" fill="none" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" />
      <path d="M110,75 Q130,80 140,90" fill="none" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" />
      {/* Left lung */}
      <path d="M55,90 Q45,120 50,150 Q60,175 85,175 Q100,170 105,155 Q108,130 108,90 Z" fill="#bfdbfe" fillOpacity="0.7" stroke="#1e3a5f" strokeWidth="2" />
      {/* Right lung */}
      <path d="M165,90 Q175,120 170,150 Q160,175 135,175 Q120,170 115,155 Q112,130 112,90 Z" fill="#bfdbfe" fillOpacity="0.7" stroke="#1e3a5f" strokeWidth="2" />
      {/* Diaphragm */}
      <path d="M50,175 Q110,195 170,175" fill="none" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" />
      {/* Alveoli hint */}
      {[75,90,80].map((y,i) => <circle key={i} cx={70+i*10} cy={y+80} r="5" fill="#dbeafe" stroke="#1e3a5f" strokeWidth="1" />)}
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -28 : 28)} y2={p.y} stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -50 : 28)} y={p.y - 8} width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -39 : 39)} y={p.y + 4} text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

// BIOLOGY: Flower (longitudinal section)
const FlowerDiagram = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 110, y: 28 },
    { label: 'B', x: 145, y: 65 },
    { label: 'C', x: 110, y: 110 },
    { label: 'D', x: 75, y: 65 },
  ]
  return (
    <S w={220} h={220} caption={caption}>
      {/* Petals */}
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = angle * Math.PI / 180
        const px = 110 + Math.cos(rad) * 55
        const py = 100 + Math.sin(rad) * 55
        return <ellipse key={i} cx={110 + Math.cos(rad)*38} cy={100 + Math.sin(rad)*38} rx="20" ry="30"
          transform={`rotate(${angle}, ${110 + Math.cos(rad)*38}, ${100 + Math.sin(rad)*38})`}
          fill="#fde68a" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1.5" />
      })}
      {/* Sepals */}
      {[30,90,150,210,270,330].map((angle, i) => {
        const rad = angle * Math.PI / 180
        return <ellipse key={i} cx={110 + Math.cos(rad)*45} cy={100 + Math.sin(rad)*45} rx="10" ry="22"
          transform={`rotate(${angle}, ${110 + Math.cos(rad)*45}, ${100 + Math.sin(rad)*45})`}
          fill="#86efac" fillOpacity="0.8" stroke="#16a34a" strokeWidth="1" />
      })}
      {/* Receptacle */}
      <circle cx="110" cy="100" r="22" fill="#fef9c3" stroke="#f59e0b" strokeWidth="2" />
      {/* Stigma + style */}
      <line x1="110" y1="78" x2="110" y2="55" stroke="#1e3a5f" strokeWidth="2" />
      <ellipse cx="110" cy="52" rx="7" ry="4" fill="#c084fc" stroke="#1e3a5f" strokeWidth="1.5" />
      {/* Stamen */}
      {[-12,0,12].map((dx,i) => (
        <g key={i}>
          <line x1={110+dx} y1="85" x2={110+dx} y2="65" stroke="#1e3a5f" strokeWidth="1.5" />
          <ellipse cx={110+dx} cy="63" rx="4" ry="3" fill="#fbbf24" stroke="#1e3a5f" strokeWidth="1" />
        </g>
      ))}
      {/* Stem */}
      <line x1="110" y1="122" x2="110" y2="210" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -28 : 28)} y2={p.y} stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -50 : 28)} y={p.y - 8} width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -39 : 39)} y={p.y + 4} text={p.label} size={11} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

// BIOLOGY: Food Web
const FoodWeb = ({ params = {}, caption }) => {
  const organisms = params.organisms || [
    { name: 'Sun', x: 110, y: 20 },
    { name: 'Grass', x: 110, y: 65 },
    { name: 'Rabbit', x: 55, y: 115 },
    { name: 'Grasshopper', x: 165, y: 115 },
    { name: 'Fox', x: 55, y: 165 },
    { name: 'Hawk', x: 165, y: 165 },
  ]
  const arrows = params.arrows || [
    [0,1],[1,2],[1,3],[2,4],[3,5],[2,5]
  ]
  const colors = ['#fbbf24','#86efac','#93c5fd','#86efac','#fca5a5','#c084fc']

  return (
    <S w={220} h={200} caption={caption}>
      {arrows.map(([from, to], i) => {
        const a = organisms[from], b = organisms[to]
        if (!a || !b) return null
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        const angle = Math.atan2(b.y - a.y, b.x - a.x)
        const arr = 7
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y + 10} x2={b.x} y2={b.y - 10} stroke="#94a3b8" strokeWidth="1.5" />
            <polygon
              points={`${b.x},${b.y - 10} ${b.x - arr * Math.cos(angle - 0.4)},${b.y - 10 - arr * Math.sin(angle - 0.4)} ${b.x - arr * Math.cos(angle + 0.4)},${b.y - 10 - arr * Math.sin(angle + 0.4)}`}
              fill="#94a3b8"
            />
          </g>
        )
      })}
      {organisms.map((o, i) => (
        <g key={i}>
          <rect x={o.x - 30} y={o.y - 11} width="60" height="22" rx="11" fill={colors[i] || '#e2e8f0'} fillOpacity="0.9" stroke="#1e3a5f" strokeWidth="1.5" />
          <Label x={o.x} y={o.y + 4} text={o.name} size={9} color="#1e3a5f" />
        </g>
      ))}
    </S>
  )
}

// PHYSICS: Ray Diagram (refraction/reflection)
const RayDiagram = ({ params = {}, caption }) => {
  const type = params.type || 'refraction'
  return (
    <S w={240} h={200} caption={caption}>
      {type === 'refraction' ? (
        <>
          {/* Interface */}
          <line x1="120" y1="20" x2="120" y2="180" stroke="#1e3a5f" strokeWidth="2" />
          <rect x="120" y="20" width="120" height="160" fill="#bfdbfe" fillOpacity="0.3" />
          <Label x={175} y={35} text="denser medium" size={9} color="#1e40af" />
          <Label x={60} y={35} text="less dense" size={9} color="#666" />
          {/* Normal */}
          <line x1="120" y1="20" x2="120" y2="180" stroke="#6b7280" strokeWidth="1" strokeDasharray="5 3" />
          {/* Incident ray */}
          <line x1="30" y1="40" x2="120" y2="100" stroke="#cc0000" strokeWidth="2" />
          <polygon points="120,100 105,88 113,102" fill="#cc0000" />
          {/* Refracted ray */}
          <line x1="120" y1="100" x2="210" y2="175" stroke="#cc0000" strokeWidth="2" />
          <polygon points="210,175 192,163 204,169" fill="#cc0000" />
          {/* Angle labels */}
          <path d="M120,70 A30,30 0 0 0 100,87" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <Label x={95} y={75} text="i" color="#f59e0b" italic size={12} />
          <path d="M120,130 A30,30 0 0 1 138,118" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <Label x={140} y={130} text="r" color="#10b981" italic size={12} anchor="start" />
        </>
      ) : (
        <>
          {/* Mirror */}
          <path d="M120,20 Q130,100 120,180" fill="none" stroke="#1e3a5f" strokeWidth="3" />
          {[30,50,70,90,110,130,150,170].map(y => (
            <line key={y} x1="120" y1={y} x2="130" y2={y + 8} stroke="#94a3b8" strokeWidth="1" />
          ))}
          {/* Normal */}
          <line x1="40" y1="100" x2="165" y2="100" stroke="#6b7280" strokeWidth="1" strokeDasharray="5 3" />
          {/* Incident ray */}
          <line x1="30" y1="50" x2="120" y2="100" stroke="#cc0000" strokeWidth="2" />
          <polygon points="120,100 104,90 110,103" fill="#cc0000" />
          {/* Reflected ray */}
          <line x1="120" y1="100" x2="30" y2="150" stroke="#3b82f6" strokeWidth="2" />
          <polygon points="30,150 47,140 42,153" fill="#3b82f6" />
          {/* Angle labels */}
          <path d="M120,75 A25,25 0 0 0 98,91" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <Label x={92} y={80} text="i" color="#f59e0b" italic size={12} />
          <path d="M120,125 A25,25 0 0 1 98,109" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <Label x={92} y={122} text="r" color="#10b981" italic size={12} />
        </>
      )}
    </S>
  )
}

// PHYSICS: Series and Parallel Circuit
const SeriesParallelCircuit = ({ params = {}, caption }) => {
  const type = params.type || 'series'
  return (
    <S w={240} h={180} caption={caption}>
      {type === 'series' ? (
        <>
          {/* Outer wire */}
          <rect x="20" y="30" width="200" height="120" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          {/* Battery */}
          <line x1="20" y1="70" x2="20" y2="110" stroke="#1e3a5f" strokeWidth="4" />
          <line x1="10" y1="78" x2="30" y2="78" stroke="#1e3a5f" strokeWidth="2.5" />
          <line x1="13" y1="90" x2="27" y2="90" stroke="#1e3a5f" strokeWidth="1.5" />
          <Label x={20} y={118} text="E" size={9} color="#333" />
          {/* R1 */}
          <path d="M85,30 l5,-8 l8,16 l8,-16 l8,16 l8,-16 l5,8" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={113} y={18} text="R₁" size={10} color="#cc0000" />
          {/* R2 */}
          <path d="M155,30 l5,-8 l8,16 l8,-16 l8,16 l8,-16 l5,8" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={183} y={18} text="R₂" size={10} color="#cc0000" />
          {/* Switch */}
          <circle cx="120" cy="150" r="4" fill="#1e3a5f" />
          <circle cx="150" cy="150" r="4" fill="#1e3a5f" />
          <line x1="120" y1="150" x2="147" y2="143" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={135} y={168} text="S" size={9} color="#333" />
          <Label x={120} y={20} text="Series Circuit" size={10} color="#1e3a5f" />
        </>
      ) : (
        <>
          {/* Outer wire */}
          <rect x="20" y="20" width="200" height="140" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          {/* Battery */}
          <line x1="20" y1="65" x2="20" y2="105" stroke="#1e3a5f" strokeWidth="4" />
          <line x1="10" y1="73" x2="30" y2="73" stroke="#1e3a5f" strokeWidth="2.5" />
          <line x1="13" y1="85" x2="27" y2="85" stroke="#1e3a5f" strokeWidth="1.5" />
          {/* Parallel branches */}
          <line x1="120" y1="20" x2="120" y2="50" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="120" y1="130" x2="120" y2="160" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="80" y1="50" x2="160" y2="50" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="80" y1="130" x2="160" y2="130" stroke="#1e3a5f" strokeWidth="2" />
          {/* R1 branch */}
          <line x1="80" y1="50" x2="80" y2="70" stroke="#1e3a5f" strokeWidth="2" />
          <path d="M80,70 l-6,6 l12,12 l-12,12 l12,12 l-6,6" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="80" y1="118" x2="80" y2="130" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={94} y={95} text="R₁" size={10} color="#cc0000" anchor="start" />
          {/* R2 branch */}
          <line x1="160" y1="50" x2="160" y2="70" stroke="#1e3a5f" strokeWidth="2" />
          <path d="M160,70 l-6,6 l12,12 l-12,12 l12,12 l-6,6" fill="none" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="160" y1="118" x2="160" y2="130" stroke="#1e3a5f" strokeWidth="2" />
          <Label x={174} y={95} text="R₂" size={10} color="#cc0000" anchor="start" />
          <Label x={120} y={14} text="Parallel Circuit" size={10} color="#1e3a5f" />
        </>
      )}
    </S>
  )
}

// GEOGRAPHY: Water Cycle
const WaterCycle = ({ params = {}, caption }) => (
  <S w={260} h={200} caption={caption}>
    {/* Sky */}
    <rect x="0" y="0" width="260" height="130" fill="#e0f2fe" />
    {/* Ground */}
    <rect x="0" y="130" width="260" height="70" fill="#fef3c7" />
    {/* Water body */}
    <ellipse cx="50" cy="145" rx="45" ry="18" fill="#93c5fd" stroke="#1e3a5f" strokeWidth="1.5" />
    <Label x={50} y={148} text="Ocean/Lake" size={8} color="#1e40af" />
    {/* Mountain */}
    <polygon points="200,130 230,60 260,130" fill="#d1d5db" stroke="#1e3a5f" strokeWidth="1.5" />
    <polygon points="185,130 215,75 245,130" fill="#e5e7eb" stroke="#1e3a5f" strokeWidth="1.5" />
    {/* Cloud */}
    <ellipse cx="130" cy="40" rx="35" ry="18" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
    <ellipse cx="110" cy="48" rx="22" ry="14" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
    <ellipse cx="152" cy="48" rx="20" ry="13" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Evaporation arrows */}
    <line x1="40" y1="127" x2="90" y2="60" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" />
    <polygon points="90,60 80,73 87,62" fill="#f97316" />
    <Label x={50} y={92} text="Evaporation" size={8} color="#ea580c" italic />
    {/* Precipitation */}
    {[115,125,135].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="62" x2={x - 5} y2="85" stroke="#3b82f6" strokeWidth="1.5" />
        <polygon points={`${x-5},85 ${x-9},74 ${x-1},74`} fill="#3b82f6" />
      </g>
    ))}
    <Label x={132} y={80} text="Precipitation" size={8} color="#1d4ed8" italic anchor="start" />
    {/* Surface runoff */}
    <path d="M215,130 Q170,138 90,140 Q70,141 55,145" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <polygon points="55,145 70,139 68,147" fill="#3b82f6" />
    <Label x={145} y={135} text="Runoff" size={8} color="#1d4ed8" />
    {/* Transpiration */}
    <line x1="185" y1="115" x2="155" y2="55" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" />
    <polygon points="155,55 160,70 153,66" fill="#16a34a" />
    <Label x={158} y={90} text="Transpiration" size={8} color="#15803d" italic anchor="start" />
  </S>
)

// GEOGRAPHY: Rock Cycle
const RockCycle = ({ params = {}, caption }) => (
  <S w={240} h={220} caption={caption}>
    {/* Three rock type boxes */}
    <rect x="15" y="15" width="70" height="40" rx="8" fill="#fde68a" stroke="#1e3a5f" strokeWidth="1.5" />
    <Label x={50} y={40} text="Igneous" size={11} color="#1e3a5f" />
    <rect x="155" y="15" width="70" height="40" rx="8" fill="#bbf7d0" stroke="#1e3a5f" strokeWidth="1.5" />
    <Label x={190} y={40} text="Sedimentary" size={9} color="#1e3a5f" />
    <rect x="85" y="165" width="70" height="40" rx="8" fill="#ddd6fe" stroke="#1e3a5f" strokeWidth="1.5" />
    <Label x={120} y={190} text="Metamorphic" size={9} color="#1e3a5f" />
    {/* Magma at center */}
    <ellipse cx="120" cy="108" rx="30" ry="22" fill="#fca5a5" stroke="#cc0000" strokeWidth="2" />
    <Label x={120} y={112} text="Magma" size={10} color="#9b1c1c" />
    {/* Arrows */}
    {/* Igneous → Sedimentary (weathering) */}
    <path d="M85,25 Q120,10 155,25" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
    <polygon points="155,25 141,18 144,28" fill="#1e3a5f" />
    <Label x={120} y={12} text="Weathering" size={8} color="#333" />
    {/* Sedimentary → Metamorphic */}
    <path d="M175,55 Q165,110 155,165" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
    <polygon points="155,165 154,150 162,155" fill="#1e3a5f" />
    <Label x={172} y={112} text="Heat/Pressure" size={8} color="#333" anchor="start" />
    {/* Metamorphic → Magma */}
    <path d="M100,165 Q95,140 110,130" fill="none" stroke="#cc0000" strokeWidth="1.5" />
    <polygon points="110,130 100,142 108,143" fill="#cc0000" />
    <Label x={82} y={148} text="Melting" size={8} color="#9b1c1c" anchor="end" />
    {/* Magma → Igneous */}
    <path d="M95,100 Q70,85 60,55" fill="none" stroke="#cc0000" strokeWidth="1.5" />
    <polygon points="60,55 68,68 61,65" fill="#cc0000" />
    <Label x={65} y={82} text="Cooling" size={8} color="#9b1c1c" anchor="end" />
  </S>
)

// DATA TABLE: renders a question table
const DataTable = ({ params = {}, caption }) => {
  const headers = params.headers || ['Category', 'Value']
  const rows = params.rows || [['A', '10'], ['B', '20'], ['C', '30']]
  const colW = Math.floor(190 / headers.length)
  const rowH = 22
  const tableH = (rows.length + 1) * rowH + 20
  return (
    <S w={220} h={Math.max(tableH, 100)} caption={caption}>
      {/* Header row */}
      <rect x="15" y="10" width="190" height={rowH} fill="#1e3a5f" rx="4" />
      {headers.map((h, i) => (
        <Label key={i} x={15 + i * colW + colW / 2} y={10 + rowH - 6} text={h} size={10} color="white" />
      ))}
      {/* Data rows */}
      {rows.map((row, ri) => (
        <g key={ri}>
          <rect x="15" y={10 + (ri + 1) * rowH} width="190" height={rowH}
            fill={ri % 2 === 0 ? '#f8fafc' : '#e8f0fe'} stroke="#e2e8f0" strokeWidth="1" />
          {row.map((cell, ci) => (
            <Label key={ci} x={15 + ci * colW + colW / 2} y={10 + (ri + 1) * rowH + rowH - 7}
              text={String(cell)} size={9} color="#333" />
          ))}
        </g>
      ))}
      {/* Border */}
      <rect x="15" y="10" width="190" height={(rows.length + 1) * rowH} fill="none" stroke="#1e3a5f" strokeWidth="1.5" rx="4" />
      {/* Column dividers */}
      {headers.slice(0, -1).map((_, i) => (
        <line key={i} x1={15 + (i + 1) * colW} y1="10" x2={15 + (i + 1) * colW} y2={10 + (rows.length + 1) * rowH}
          stroke="#94a3b8" strokeWidth="1" />
      ))}
    </S>
  )
}

// BIOLOGY: Nephron (kidney tubule)
const Nephron = ({ params = {}, caption }) => {
  const parts = params.labelledParts || [
    { label: 'A', x: 110, y: 30 },
    { label: 'B', x: 155, y: 70 },
    { label: 'C', x: 110, y: 115 },
    { label: 'D', x: 65, y: 70 },
  ]
  return (
    <S w={220} h={220} caption={caption}>
      {/* Bowman's capsule */}
      <circle cx="110" cy="50" r="28" fill="#fef9c3" stroke="#1e3a5f" strokeWidth="2" />
      {/* Glomerulus */}
      <circle cx="110" cy="50" r="16" fill="#fca5a5" stroke="#cc0000" strokeWidth="1.5" />
      {/* Proximal tubule */}
      <path d="M135,58 Q160,65 155,90 Q150,115 130,120 Q110,125 110,148" fill="none" stroke="#86efac" strokeWidth="5" strokeLinecap="round" />
      {/* Loop of Henle */}
      <path d="M110,148 Q108,170 100,175 Q90,180 85,170 Q80,155 88,140" fill="none" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
      {/* Distal tubule */}
      <path d="M88,140 Q80,115 90,95 Q100,75 110,78" fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
      {/* Collecting duct */}
      <line x1="110" y1="78" x2="110" y2="50" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      {/* Labels */}
      {parts.map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1={p.y} x2={p.x + (p.x < 110 ? -28 : 28)} y2={p.y} stroke="#666" strokeWidth="1" />
          <rect x={p.x + (p.x < 110 ? -50 : 28)} y={p.y - 8} width="22" height="16" fill="white" stroke="#1e3a5f" strokeWidth="1" rx="3" />
          <Label x={p.x + (p.x < 110 ? -39 : 39)} y={p.y + 4} text={p.label} size={11} color="#1e3a5f" />
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
// Math: cylinder, sphere, cone, triangle, right_triangle, circle, coordinate_grid,
//       bearing, number_line, similar_shapes, bar_chart, pie_chart, histogram,
//       venn_diagram, line_graph
// Science: animal_cell, plant_cell, microscope, beaker, soil_profile, circuit,
//          human_heart, digestive_system, respiratory_system, flower, food_web,
//          ray_diagram, series_parallel_circuit, nephron
// Other: water_cycle, rock_cycle, data_table

export default function DiagramRenderer({ diagram }) {
  if (!diagram || !diagram.type) return null

  const { type, params, caption, labelledParts } = diagram
  const p = { ...params, labelledParts }

  const components = {
    // ── Mathematics ──────────────────────────────────────────────────────
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
    bar_chart: BarChart,
    pie_chart: PieChart,
    histogram: Histogram,
    venn_diagram: VennDiagram,
    line_graph: LineGraph,
    // ── Biology ──────────────────────────────────────────────────────────
    animal_cell: AnimalCell,
    plant_cell: PlantCell,
    microscope: Microscope,
    beaker: Beaker,
    soil_profile: SoilProfile,
    circuit: BasicCircuit,
    human_heart: HumanHeart,
    digestive_system: DigestiveSystem,
    respiratory_system: RespiratorySystem,
    flower: FlowerDiagram,
    food_web: FoodWeb,
    nephron: Nephron,
    // ── Physics ──────────────────────────────────────────────────────────
    ray_diagram: RayDiagram,
    series_parallel_circuit: SeriesParallelCircuit,
    // ── Geography ────────────────────────────────────────────────────────
    water_cycle: WaterCycle,
    rock_cycle: RockCycle,
    // ── Utility ──────────────────────────────────────────────────────────
    data_table: DataTable,
  }

  const Component = components[type] || GenericDiagram
  return <Component params={p} caption={caption} />
}
