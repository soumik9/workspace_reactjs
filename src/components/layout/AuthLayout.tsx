import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { workspaceAuthItems } from '../../libs/constant/common.constant';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen overflow-hidden bg-gray-50 font-sans text-gray-900 lg:grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]">
      <aside className="hidden min-h-0 flex-col bg-purple-700 px-6 py-8 text-white sm:px-12 lg:flex lg:p-10 xl:p-14">

        <div className="flex w-fit items-center space-x-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className="rounded-xl bg-white/15 p-3">
            <FaFolderOpen className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Workspace
          </span>
        </div>

        <div className="my-auto max-w-md py-6 [@media(max-height:700px)]:py-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-purple-200">
            A little order. More possibilities.
          </p>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl [@media(max-height:700px)]:text-3xl">
            Your ideas deserve a place of their own.
          </h1>

          <p className="mt-5 leading-relaxed text-purple-100">
            Keep your folders, notes, and next big idea together in one simple workspace.
          </p>

          <div aria-hidden="true" className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5 [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:p-3">
            <div className="flex items-center space-x-3 border-b border-white/15 pb-4">
              <FaFolderOpen className="text-yellow-300" />
              <span className="text-sm font-medium">My workspace</span>
            </div>

            <div className="ml-2 mt-4 space-y-4 border-l border-white/20 pl-5 text-sm text-purple-100 [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:space-y-2">
              {workspaceAuthItems.map(({ name, icon: Icon, className }) => (
                <div key={name} className="flex items-center space-x-3">
                  <Icon className={className} />
                  <span>{name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </aside>
      <main className="flex h-full min-h-0 items-center justify-center px-6 py-4 sm:px-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
};
