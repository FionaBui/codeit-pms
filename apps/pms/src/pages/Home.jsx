import { Button, Input } from '@codeit/ui';

export function Home() {
  return (
    <div className="p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-semibold mb-2 text-slate-800">Welcome to PMS</h1>
      <p className="text-slate-600 mb-6 max-w-xl">
        This is an example home page. Use this area to show key project information,
        quick links, or onboarding content for your users.
      </p>

      <div className="bg-white rounded-md shadow-sm p-4 max-w-md space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Quick search
          </label>
          <Input placeholder="Search projects..." />
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="default">Clear</Button>
          <Button type="primary">Search</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;

