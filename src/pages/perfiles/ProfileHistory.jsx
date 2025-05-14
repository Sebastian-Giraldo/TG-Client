// src/pages/perfiles/ProfileHistory.jsx
import React, { useState, useEffect } from 'react'
import ResultadosTable from '../../components/ResultadoTable'
import Sidebar from '../../components/Sidebar'
import { db } from '../../firebase/firebase'        
import './stylesProfileHistory.css'

export default function ProfileHistory() {
  const [allProfiles, setAllProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)

  // 1) Carga inicial desde Firestore
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const col = await db
          .collection('profiles')
          .orderBy('checkedAt', 'desc')
          .limit(1000)               // o el número máximo que guardes
          .get()
        const docs = col.docs.map(d => ({ id: d.id, ...d.data() }))
        setAllProfiles(docs)
        setFilteredProfiles(docs)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfiles()
  }, [])

  // 2) handleSearch
  const handleSearch = e => {
    e.preventDefault()
    let term = searchTerm.trim()
    // quita arroba inicial si la hay
    if (term.startsWith('@')) term = term.slice(1)
    if (term === '') {
      // vacío => muestra todo
      setFilteredProfiles(allProfiles)
      setError(null)
      return
    }
    // filtra con contains (case-insensitive)
    const filtered = allProfiles.filter(p =>
      p.username.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredProfiles(filtered)
    if (filtered.length === 0) {
      setError(`No existen registros con el perfil “${searchTerm.trim()}”`)
    } else {
      setError(null)
    }
  }

  // 3) handleClear
  const handleClear = () => {
    setSearchTerm('')
    setFilteredProfiles(allProfiles)
    setError(null)
  }

  return (
    <>
      <Sidebar />
       <div className="ph-container">
      <h1 className="ph-title">Historial de perfiles</h1>

      <form className="ph-searchForm" onSubmit={handleSearch}>
        <input
          className="ph-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por username..."
          onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
        />
        <button className="ph-btn ph-search" type="submit">Buscar</button>
        <button className="ph-btn ph-clear" type="button" onClick={handleClear}>Limpiar</button>
      </form>

      {error && <div className="ph-error">{error}</div>}

      <div className="ph-results">
        <ResultadosTable allResults={filteredProfiles} />
      </div>
    </div>
    </>
  )
}
