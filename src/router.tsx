import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { BroadcastLayout } from './components/BroadcastLayout';
import { ScoringLayout } from './components/scoringLayout/ScoringLayout';
import { FootballScoringPage } from './pages/footballScoring/FootballScoringPage';
import { BroadcastPage } from './pages/broadcast/BroadcastPage';

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});

const broadcastRoutes = createRoute({
  getParentRoute: () => rootRoute,
  id: 'broadcast',
  component: () => (
    <BroadcastLayout>
      <Outlet />
    </BroadcastLayout>
  ),
});

const scoringRoutes = createRoute({
  getParentRoute: () => rootRoute,
  id: 'scoring',
  component: () => (
    <ScoringLayout>
      <Outlet />
    </ScoringLayout>
  ),
});

const scoringRoute = createRoute({
  getParentRoute: () => scoringRoutes,
  path: '/scoring/$id',
  component: FootballScoringPage,
});
const broadcastRoute = createRoute({
  getParentRoute: () => broadcastRoutes,
  path: '/bc/$id',
  component: BroadcastPage,
});

const routeTree = rootRoute.addChildren([
  scoringRoutes.addChildren([scoringRoute]),
  broadcastRoutes.addChildren([broadcastRoute]),
]);

const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

export const Router = () => <RouterProvider router={router} />;
