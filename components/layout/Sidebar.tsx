import React from 'react';
import { Page } from '../../types';
import { DashboardIcon, TransactionsIcon, AnalyticsIcon, BudgetsIcon, SettingsIcon, LogoutIcon, XIcon, UserIcon } from '../ui/Icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  logout: () => void;
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  userEmail: string;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? 'bg-primary-800 text-white'
        : 'text-gray-300 hover:bg-primary-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, logout, isOpen, onClose, userName, userAvatar, userEmail }) => {
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    onClose();
  };
  
  const renderAvatar = () => {
    if (userAvatar) {
        return <img src={userAvatar} alt="User Avatar" className="h-10 w-10 rounded-full" />;
    }
    return (
        <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0).toUpperCase()}
        </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`w-64 bg-primary-900 text-white flex flex-col p-4 fixed h-full z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-lg">
              <AnalyticsIcon className="h-6 w-6 text-primary-700" />
            </div>
            <h1 className="text-2xl font-bold ml-3">expenzo</h1>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul>
            <NavItem
              icon={<DashboardIcon className="h-6 w-6" />}
              label="Dashboard"
              isActive={currentPage === Page.DASHBOARD}
              onClick={() => handleNavClick(Page.DASHBOARD)}
            />
            <NavItem
              icon={<TransactionsIcon className="h-6 w-6" />}
              label="Transactions"
              isActive={currentPage === Page.TRANSACTIONS}
              onClick={() => handleNavClick(Page.TRANSACTIONS)}
            />
            <NavItem
              icon={<AnalyticsIcon className="h-6 w-6" />}
              label="Analytics"
              isActive={currentPage === Page.ANALYTICS}
              onClick={() => handleNavClick(Page.ANALYTICS)}
            />
            <NavItem
              icon={<BudgetsIcon className="h-6 w-6" />}
              label="Budgets"
              isActive={currentPage === Page.BUDGETS}
              onClick={() => handleNavClick(Page.BUDGETS)}
            />
            <NavItem
              icon={<UserIcon className="h-6 w-6" />}
              label="Profile"
              isActive={currentPage === Page.PROFILE}
              onClick={() => handleNavClick(Page.PROFILE)}
            />
            <NavItem
              icon={<SettingsIcon className="h-6 w-6" />}
              label="Settings"
              isActive={currentPage === Page.SETTINGS}
              onClick={() => handleNavClick(Page.SETTINGS)}
            />
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="border-t border-primary-800 my-4"></div>
          <div className="flex items-center p-2 rounded-lg mb-2">
            {renderAvatar()}
            <div className="ml-3">
              <p className="font-semibold text-white text-sm">{userName}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          </div>
          <NavItem
            icon={<LogoutIcon className="h-6 w-6" />}
            label="Logout"
            isActive={false}
            onClick={logout}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;