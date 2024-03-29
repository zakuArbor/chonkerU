import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
  HeaderMenu,
} from '@carbon/react';
import { Link } from 'react-router-dom';
import { Switcher, Notification, UserAvatar } from '@carbon/icons-react';

const CUHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="CU-Visualizer">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName element={Link} to={"/"} prefix="zakuarbor">
          ChonkerU
        </HeaderName>
        <HeaderNavigation aria-label="Carbon Tutorial">
          <HeaderMenuItem element={Link} to={"/courses"}>Courses</HeaderMenuItem>
          <HeaderMenuItem element={Link} to={"profs"}>Professors</HeaderMenuItem>
          <HeaderMenuItem element={Link} to={"programs"}>Programs</HeaderMenuItem>
          <HeaderMenuItem element={Link} to={"test/progression"}>Progression</HeaderMenuItem>
          <HeaderMenuItem element={Link} to={"dashboard"}>Dashboard</HeaderMenuItem>
        </HeaderNavigation>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          onOverlayClick={onClickSideNavExpand}
          isPersistent={false}
        >
          <SideNavItems>
            <HeaderSideNavItems isActive={true}>
              <HeaderMenuItem element={Link} to={"/courses"}>Courses</HeaderMenuItem>
              <HeaderMenuItem element={Link} to={"/profs"}>Professors</HeaderMenuItem>
              <HeaderMenuItem element={Link} to={"programs"}>Programs</HeaderMenuItem>
              <HeaderMenuItem element={Link} to={"test/progression"}>Progression</HeaderMenuItem>
              <HeaderMenuItem element={Link} to={"dashboard"}>Dashboard</HeaderMenuItem>
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>
      <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="center">
        <Notification size={20} />
      </HeaderGlobalAction>
      <HeaderGlobalAction aria-label="User Avatar" tooltipAlignment="center">
        <UserAvatar size={20} />
      </HeaderGlobalAction>
      <HeaderGlobalAction aria-label="App Switcher" tooltipAlignment="end">
        <Switcher size={20} />
      </HeaderGlobalAction>
    </HeaderGlobalBar>

      </Header>
    )}
  />
);

export default CUHeader;

