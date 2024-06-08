import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScoringLayout } from './components/scoringLayout/ScoringLayout';
import './index.css';
import { FootballScoringPage } from './pages/footballScoring/FootballScoringPage';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import { ThemeProvider } from './providers/themeProvider';
const queryClient = new QueryClient();

dayjs.locale(hu);
dayjs.extend(duration);
dayjs.extend(utc);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ScoringLayout>
          <FootballScoringPage />
        </ScoringLayout>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
