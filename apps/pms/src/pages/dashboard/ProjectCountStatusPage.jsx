import { useAuth } from '@codeit/auth';
import { useEffect } from 'react';
import { listProjects } from '../../api/projectApi';

export default function ProjectCountStatusPage() {
  useEffect(() => {
    listProjects().then((projects) => {
      console.log(projects);
    });
  }, []);

  return <h1>Project Count & Status</h1>;
}
