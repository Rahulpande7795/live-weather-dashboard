export default function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-canvas">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>
      <div className="bg-noise" />
    </div>
  )
}
