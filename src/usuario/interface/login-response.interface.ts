export interface LoginResponse {
    id: string;
    nombre: string;
    username: string;
    userType: 'usuario' | 'cliente';
    token: string;
    rol?: string; // Solo para usuarios
    telefono?: string;
}

