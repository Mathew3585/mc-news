import React, { useState, useEffect } from 'react'
import './NewsForm.css'

function NewsForm({ newsData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'info',
    isNew: true,
    fullDescription: ''
  })

  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title || '',
        description: newsData.description || '',
        type: newsData.type || 'info',
        isNew: newsData.isNew !== undefined ? newsData.isNew : true,
        fullDescription: newsData.fullDescription || ''
      })
    }
  }, [newsData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const insertHTMLTemplate = () => {
    const template = `<p>Votre contenu ici...</p>

<h3>Section 1</h3>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
  <li>Point 3</li>
</ul>

<h3>Section 2</h3>
<p><strong>Texte en gras</strong> et texte normal.</p>`

    setFormData(prev => ({
      ...prev,
      fullDescription: template
    }))
  }

  return (
    <div className="news-form-container">
      <div className="form-header">
        <h2>
          <i className={`fas ${newsData ? 'fa-edit' : 'fa-plus'}`}></i>
          {newsData ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
        </h2>
        <button onClick={onCancel} className="btn-close" title="Fermer">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              <i className="fas fa-heading"></i>
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Nouvelle mise à jour disponible"
              maxLength={100}
              required
            />
            <small>{formData.title.length}/100 caractères</small>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i>
              Type *
            </label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="update">🔼 Mise à jour</option>
              <option value="event">⭐ Événement</option>
              <option value="reset">🔄 Reset</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="info">🔔 Info</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-align-left"></i>
            Description courte *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Ajout de nouveaux mods et amélioration des performances"
            maxLength={150}
            required
          />
          <small>{formData.description.length}/150 caractères</small>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
            />
            <span>
              <i className="fas fa-star"></i>
              Marquer comme "Nouveau"
            </span>
          </label>
        </div>

        <div className="form-group">
          <div className="label-with-actions">
            <label>
              <i className="fas fa-code"></i>
              Contenu complet (HTML) *
            </label>
            <button
              type="button"
              onClick={insertHTMLTemplate}
              className="btn-template"
              title="Insérer un template"
            >
              <i className="fas fa-file-code"></i>
              Template
            </button>
          </div>
          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            placeholder="<p>Contenu HTML complet...</p>"
            rows={15}
            required
          />
          <small>Utilisez du HTML : &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</small>
        </div>

        {/* Preview */}
        {formData.fullDescription && (
          <div className="preview-section">
            <h3>
              <i className="fas fa-eye"></i>
              Aperçu
            </h3>
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: formData.fullDescription }} />
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            <i className="fas fa-times"></i>
            Annuler
          </button>
          <button type="submit" className="btn-submit">
            <i className={`fas ${newsData ? 'fa-save' : 'fa-plus'}`}></i>
            {newsData ? 'Mettre à jour' : 'Créer l\'actualité'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewsForm
