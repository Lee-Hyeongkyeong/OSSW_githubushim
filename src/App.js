import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Survey from './pages/SurveyMain';
import Survey1 from './pages/Survey1';
import Survey1_1 from './pages/Survey1-1';
import Survey1_2 from './pages/Survey1-2';
import Survey2 from './pages/Survey2';
import Survey2_1 from './pages/Survey2-1';
import Survey2_2 from './pages/Survey2-2';
import SurveyLoading from './pages/SurveyLoading';
import Recommendation from './pages/Recommendation1';
import Recommendation2 from './pages/Recommendation2';
import Recommendation3 from './pages/Recommendation3';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/survey-main' element={<Survey />} />
        <Route path='/survey-step1' element={<Survey1 />} />
        <Route path='/survey-step1-1' element={<Survey1_1 />} />
        <Route path='/survey-step1-2' element={<Survey1_2 />} />
        <Route path='/survey-step2' element={<Survey2 />} />
        <Route path='/survey-step2-1' element={<Survey2_1 />} />
        <Route path='/survey-step2-2' element={<Survey2_2 />} />
        <Route path='/survey-loading' element={<SurveyLoading />} />
        <Route path='/recommend-city' element={<Recommendation />} />
        <Route path='/recommend-abstract' element={<Recommendation2 />} />
        <Route path='/recommend-detail' element={<Recommendation3 />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;