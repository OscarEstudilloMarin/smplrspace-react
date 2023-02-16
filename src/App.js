import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HelloWorldMain from "./pages/hello-world/HelloWorldMain";
import CustomMain from "./pages/custom-test/CustomMain";
import Index from "./pages/index";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='*' element={<Index />} />
          <Route path='/hello-world' element={<HelloWorldMain />} />
          <Route path='/custom-test' element={<CustomMain />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
