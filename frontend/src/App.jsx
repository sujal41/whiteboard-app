import { useContext, useEffect } from 'react';
import AuthProvider, { AuthContext } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import socket from './socket';


const App = () => {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App