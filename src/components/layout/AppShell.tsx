import { TopBar } from './TopBar';
import { SideNav } from './SideNav';
import { useAppStore } from '@/store/useAppStore';
import { CaseInboxPage } from '@/pages/CaseInbox/CaseInboxPage';
import { CaseWorkbenchPage } from '@/pages/CaseWorkbench/CaseWorkbenchPage';
import { EvidencePage } from '@/pages/Evidence/EvidencePage';
import { CopilotPage } from '@/pages/Copilot/CopilotPage';
import { ReportsPage } from '@/pages/Reports/ReportsPage';
import { PoliciesPage } from '@/pages/Policies/PoliciesPage';

export function AppShell() {
  const currentPage = useAppStore((s) => s.currentPage);

  const pages: Record<string, React.ReactNode> = {
    inbox: <CaseInboxPage />,
    workbench: <CaseWorkbenchPage />,
    evidence: <EvidencePage />,
    copilot: <CopilotPage />,
    reports: <ReportsPage />,
    policies: <PoliciesPage />,
  };
  const pageContent = pages[currentPage] ?? <CaseInboxPage />;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
      <SideNav />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          {pageContent}
        </main>
      </div>
    </div>
  );
}
