import { FC, PropsWithChildren } from 'react';

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div id="layout">
    <div id="page-container">{children}</div>
  </div>
);
