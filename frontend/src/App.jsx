import { useContext, useEffect } from 'react';
import AuthProvider, { AuthContext } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import socket from './socket';
import WhiteBoardProvider from './context/WhiteBoardContext';


const App = () => {

  return (
    <AuthProvider>
      <WhiteBoardProvider>
        <AppRoutes />
      </WhiteBoardProvider>
    </AuthProvider>
  )
}

export default App