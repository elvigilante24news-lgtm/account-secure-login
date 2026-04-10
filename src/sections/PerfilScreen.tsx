import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, CreditCard, Calendar, MapPin, LogOut, Edit2, Check, X, Save, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store';
import { toast } from 'sonner';

interface PerfilScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function PerfilScreen({ onBack, onLogout }: PerfilScreenProps) {
  const { user, participaciones, notificaciones, actualizarPerfil, cambiarPassword } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    dni: user?.dni || '',
    fechaNacimiento: user?.fechaNacimiento || '',
    ciudad: user?.ciudad || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const misParticipaciones = participaciones.filter(p => p.userId === user?.id);
  const misNotificaciones = notificaciones.filter(n => n.userId === user?.id && !n.leida);

  const handleLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      toast.error('El nombre y apellido son obligatorios');
      setIsSaving(false);
      return;
    }

    if (!formData.telefono.trim()) {
      toast.error('El teléfono es obligatorio');
      setIsSaving(false);
      return;
    }

    if (!formData.ciudad.trim()) {
      toast.error('La ciudad es obligatoria');
      setIsSaving(false);
      return;
    }

    try {
      const success = await actualizarPerfil(formData);
      if (success) {
        toast.success('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      dni: user?.dni || '',
      fechaNacimiento: user?.fechaNacimiento || '',
      ciudad: user?.ciudad || ''
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    // Validaciones
    if (!passwordData.currentPassword) {
      toast.error('Ingresá tu contraseña actual');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const success = await cambiarPasswordDesdePerfil(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      toast.success('Contraseña cambiada correctamente');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error('Contraseña actual incorrecta');
    }
  };

  const cambiarPasswordDesdePerfil = async (currentPass: string, newPass: string): Promise<boolean> => {
    const usuarios = JSON.parse(localStorage.getItem('hiperdelpollo-users') || '[]');
    const usuarioIndex = usuarios.findIndex((u: any) => u.id === user?.id && u.password === currentPass);
    
    if (usuarioIndex === -1) {
      return false;
    }

    usuarios[usuarioIndex].password = newPass;
    localStorage.setItem('hiperdelpollo-users', JSON.stringify(usuarios));
    return true;
  };

  return (
    <div className="min-h-screen w-full pb-24">
      {/* Header */}
      <div className="bg-pollo-marron px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-pollo-lg relative overflow-hidden">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full" />
        
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-black text-white">
                {user?.nombre.charAt(0)}{user?.apellido.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {user?.nombre} {user?.apellido}
              </h1>
              <p className="text-white/80 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pollo-amarillo/30">
            <p className="text-2xl font-black text-pollo-marron">{misParticipaciones.length}</p>
            <p className="text-xs text-pollo-marron/60">Participaciones</p>
          </div>
          <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pollo-amarillo/30">
            <p className="text-2xl font-black text-pollo-marron">
              {misParticipaciones.filter(p => p.estado === 'ganador').length}
            </p>
            <p className="text-xs text-pollo-marron/60">Premios</p>
          </div>
          <div className="bg-pollo-fondo-claro/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pollo-amarillo/30">
            <p className="text-2xl font-black text-pollo-marron">{misNotificaciones.length}</p>
            <p className="text-xs text-pollo-marron/60">Notificaciones</p>
          </div>
        </div>

        {/* Datos personales */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-pollo-marron">Mis Datos</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm text-pollo-marron font-semibold bg-pollo-amarillo/20 px-3 py-2 rounded-xl shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-sm text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-xl"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 text-sm text-white font-semibold bg-green-500 px-3 py-2 rounded-xl disabled:opacity-70"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Nombre */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Nombre</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full font-semibold text-pollo-marron bg-transparent border-b border-pollo-marron focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-pollo-marron">{user?.nombre}</p>
                )}
              </div>
            </div>

            {/* Apellido */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Apellido</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    className="w-full font-semibold text-pollo-marron bg-transparent border-b border-pollo-marron focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-pollo-marron">{user?.apellido}</p>
                )}
              </div>
            </div>

            {/* Email (no editable) */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Email</p>
                <p className="font-semibold text-pollo-marron">{user?.email}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Teléfono</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full font-semibold text-pollo-marron bg-transparent border-b border-pollo-marron focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-pollo-marron">{user?.telefono}</p>
                )}
              </div>
            </div>

            {/* DNI (no editable) */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">DNI</p>
                <p className="font-semibold text-pollo-marron">{user?.dni}</p>
              </div>
            </div>

            {/* Fecha de nacimiento (no editable) */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Fecha de nacimiento</p>
                <p className="font-semibold text-pollo-marron">
                  {new Date(user?.fechaNacimiento || '').toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex items-center gap-4 p-4 bg-pollo-fondo-claro/80 rounded-2xl border border-pollo-marron/20">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-pollo-marron/50">Ciudad</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    className="w-full font-semibold text-pollo-marron bg-transparent border-b border-pollo-marron focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-pollo-marron">{user?.ciudad}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-pollo-amarillo/10 border border-pollo-amarillo/30 rounded-2xl text-pollo-marron font-semibold hover:bg-pollo-amarillo/20 transition-colors shadow-md"
        >
          <Edit2 className="w-5 h-5" />
          Cambiar Contraseña
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-semibold hover:bg-red-100 transition-colors shadow-md"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-scale-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-pollo-marron text-center mb-2">
              ¿Cerrar sesión?
            </h3>
            <p className="text-pollo-marron/60 text-center mb-6">
              Vas a salir de tu cuenta. ¿Estás seguro?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-pollo-marron border-2 border-destructive"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-pollo-marron">Cambiar Contraseña</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pollo-marron mb-1">Contraseña actual</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-pollo-amarillo/30 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pollo-marron/40"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-pollo-marron mb-1">Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-pollo-amarillo/30 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pollo-marron/40"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-pollo-marron/50 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pollo-marron mb-1">Confirmar nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-pollo-amarillo/30 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pollo-marron/40"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full btn-primary py-3"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
