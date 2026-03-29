import {Link, Route,Routes} from 'react-router-dom'
import SchedulePage from './components/SchedulePage';
import './App.css'
import LookUp from './components/LookUp';
function Schedule(){
  return(
    <div>
      <SchedulePage />
    </div>
  )
}
function LookUpPage(){
  return(
    <div>
      <LookUp />

    </div>
  )
}
//app function has some basic inline css for styling the header and nav links, and sets up the routes for the Schedule and LookUp pages
function App() {
  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <nav style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <h1 style={{
              margin: 0,
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              BitGreen Scheduler
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                  fontWeight: '500'
                }}

              >
                Schedule
              </Link>
              <Link
                to="/LookUp"
                style={{
                  color: '#475569',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                  fontWeight: '500'
                }}
              >
                Look Up
              </Link>
            </div>
          </nav>
        </header>
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          <Routes>
            <Route path="/" element={<Schedule />} />
            <Route path="/LookUp" element={<LookUpPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
