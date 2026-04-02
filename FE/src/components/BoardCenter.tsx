export default function BoardCenter() {
  return (
    <div id="board-center">
      <h2>CỜ TỶ PHÚ</h2>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#f06090' }}>style</span>
          <span style={{ fontSize: 8, fontFamily: 'Orbitron, sans-serif', color: '#f06090', letterSpacing: 1, fontWeight: 700 }}>KHÍ VẬN</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#5bc8e8' }}>help</span>
          <span style={{ fontSize: 8, fontFamily: 'Orbitron, sans-serif', color: '#5bc8e8', letterSpacing: 1, fontWeight: 700 }}>CƠ HỘI</span>
        </div>
      </div>
    </div>
  );
}
