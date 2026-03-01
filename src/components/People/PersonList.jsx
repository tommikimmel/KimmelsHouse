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
    <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg p-4 sm:p-6 border border-accent-primary/30 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Integrantes de la Casa</h2>
          <p className="text-sm text-gray-400 mt-1">{people.length} {people.length === 1 ? 'persona registrada' : 'personas registradas'}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Agregar Persona</span>
          <span className="sm:hidden">Agregar</span>
        </button>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-accent-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-accent-primary" />
          </div>
          <p className="text-gray-400 text-lg">No hay personas registradas</p>
          <p className="text-gray-500 text-sm mt-2">Agrega a los integrantes de tu casa para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {people.map(person => (
            <div key={person.id} className="group bg-gradient-to-br from-dark-hover to-dark-card border border-accent-primary/20 rounded-xl p-5 hover:border-accent-primary/50 transition-all hover:shadow-lg hover:shadow-accent-primary/10">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="bg-gradient-to-br from-accent-primary to-blue-600 p-4 rounded-full shadow-lg shadow-accent-primary/30">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-white mb-3">{person.name}</h3>
                
                <div className="w-full space-y-2 mb-4">
                  {person.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-bg/50 rounded-lg px-3 py-2">
                      <Mail className="w-4 h-4 text-accent-primary flex-shrink-0" />
                      <span className="truncate">{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-bg/50 rounded-lg px-3 py-2">
                      <Phone className="w-4 h-4 text-accent-primary flex-shrink-0" />
                      <span className="truncate">{person.phone}</span>
                    </div>
                  )}
                  {!person.email && !person.phone && (
                    <p className="text-xs text-gray-500 italic">Sin información de contacto</p>
                  )}
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handleEdit(person)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(person)}
                    disabled={deleting === person.id}
                    className="flex items-center justify-center px-3 py-2 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar"
                  >
                    {deleting === person.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
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
