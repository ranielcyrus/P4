import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Home} from "./pages/Home";


const App = () => {
  return (
    <>
       <div className='flex flex-col min-h-screen'>
            
            <main className='flex-grow'>
            <Router>
              <Routes>
                  <Route path="/" element={<Home />}/>
              </Routes>
            </Router>
            </main>
            
        </div>
    </>
  )
}

export default App;
