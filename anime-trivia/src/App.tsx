import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import PlayPage from './pages/Play/PlayPage';
import RankingPage from './pages/Ranking/RankingPage';
import BlogListPage from './pages/Blog/BlogListPage';
import BlogPostPage from './pages/Blog/BlogPostPage';
import HowItWorksPage from './pages/Static/HowItWorksPage';
import PrivacyPolicyPage from './pages/Static/PrivacyPolicyPage';
import TermsPage from './pages/Static/TermsPage';
import ContactPage from './pages/Static/ContactPage';
import NotFoundPage from './pages/Static/NotFoundPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
