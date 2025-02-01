import { UserButton, useUser, useClerk } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { Menu } from "lucide-react";

function DashboardHeader({ toggleSideNav }) {
  const { user, isLoaded } = useUser(); // Añade isLoaded para verificar si el estado del usuario está cargado
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && !user) { // Verifica si el estado del usuario está cargado y si no hay usuario
      signOut();
    }
  }, [user, isLoaded, signOut]);

  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
      <div>
        {/* Puedes agregar contenido adicional aquí si es necesario */}
        <button
          className="sm:hidden p-2 text-black"
          onClick={toggleSideNav}
        >
          <Menu/>
        </button>
      </div>
      <div>
        <UserButton fallbackRedirectUrl='/sign-in' afterSignOutUrl='/' />
      </div>
    </div>
  );
}

export default DashboardHeader;