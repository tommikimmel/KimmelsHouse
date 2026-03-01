import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { Edit2, Trash2, Plus, User, Mail, Phone, Loader2 } from 'lucide-react';
import PersonForm from './PersonForm';

const PersonList = () => {
  const { people, deletePerson } = useApp();
  const { showSuccess, showError } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (person) => {
    if (window.confirm(`¿Está seguro de eliminar a ${person.name}?`)) {
      setDeleting(person.id);
      try {
        await deletePerson(person.id);
        showSuccess('Persona eliminada correctamente');
      } catch (error) {
        showError('Error al eliminar la persona');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedPerson(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">👨‍👩‍👧‍👦 Integrantes de la Casa</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Personas que comparten gastos • {people.length} {people.length === 1 ? 'persona' : 'personas'}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Agregar Persona</span>
        </button>
      </div>

      {people.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
            No hay personas registradas
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Agrega a los integrantes de tu casa para gestionar gastos compartidos
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {people.map(person => (
            <div key={person.id} className="stat-card" style={{ 
              borderLeft: '4px solid #007bff',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header con nombre y avatar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: '#007bff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600'
                    }}>
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        {person.name}
                      </h3>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(person)}
                      title="Editar persona"
                      style={{ padding: '6px', minWidth: 'auto' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDelete(person)}
                      disabled={deleting === person.id}
                      title="Eliminar persona"
                      style={{ padding: '6px', minWidth: 'auto' }}
                    >
                      {deleting === person.id ? (
                        <Loader2 size={16} className="spinning" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Información de contacto */}
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {person.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                      <Mail size={16} style={{ color: '#6b7280' }} />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
                      <Phone size={16} style={{ color: '#6b7280' }} />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {!person.email && !person.phone && (
                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
                      Sin información de contacto
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PersonForm
          person={selectedPerson}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default PersonList;
