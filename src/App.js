import Home from "./pages/Home"
import Join from "./pages/Join"
import Session from "./components/Session"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { ProblemProvider } from './context/ProblemContext'
import { socket } from "./tool/socketIO"
import { MessageProvider } from './context/MessageContext'

function App () {



  return (
    <BrowserRouter>
      <MessageProvider>
        <ProblemProvider>
          <MessageProvider>
            <Routes>
              <Route path="/">
                <Route
                  index
                  element={
                    // <ProtectedRoute
                      <Home />
                    // </ProtectedRoute> 
                  }
                />
              </Route>
              <Route path="/login">
                <Route
                  index
                  element={
                    // <ProtectedRoute
                      <Join />
                    // </ProtectedRoute> 
                  }
                />
              </Route>
              <Route path="/session">
                <Route
                  index
                  element={
                    // <ProtectedRoute>
                      <Session />
                    // </ProtectedRoute> 
                  }
                />
              </Route>
            </Routes>
          </MessageProvider>
        </ProblemProvider>
      </MessageProvider>
    </BrowserRouter>
  )
}

export default App
