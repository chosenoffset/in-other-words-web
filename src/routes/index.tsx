import { createFileRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  return (
    <main className="container">
      <header className="hero">
        <h1 className="title">In Other Words</h1>
        <p className="subtitle">A daily twist on wordplay. Decode a clue to find the phrase it points to.</p>
      </header>

      <section className="shell" aria-label="Game area placeholder">
        <div className="shell-inner">
          <h2 className="shell-title">Game coming soon</h2>
          <p className="muted">This is where the daily puzzle will appear??</p>
        </div>
      </section>
    </main>
  )
}
