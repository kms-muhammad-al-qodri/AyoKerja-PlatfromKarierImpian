// Utility helper to manage Saved Jobs in LocalStorage with strict User-Scoping

/**
 * Resolve unique localStorage key per user to prevent data cross-contamination between accounts
 */
const resolveUserKey = (userId) => {
  if (userId) return `careerai_saved_jobs_user_${userId}`;
  if (typeof window !== 'undefined') {
    try {
      const sessionUserId = sessionStorage.getItem('careerai_auth_user_id');
      if (sessionUserId) return `careerai_saved_jobs_user_${sessionUserId}`;
    } catch (e) {}
  }
  return 'careerai_saved_jobs_user_guest';
};

/**
 * Get list of saved jobs strictly scoped to the current user
 */
export const getSavedJobs = (userId = null) => {
  if (typeof window === 'undefined') return [];
  try {
    const key = resolveUserKey(userId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Check if a job is saved by the current user
 */
export const isJobSaved = (jobId, userId = null) => {
  if (!jobId) return false;
  const saved = getSavedJobs(userId);
  return saved.some((j) => String(j.id) === String(jobId));
};

/**
 * Toggle save / unsave a job for the current user
 */
export const toggleSaveJob = (job, userId = null) => {
  if (!job || !job.id || typeof window === 'undefined') return false;
  const key = resolveUserKey(userId);
  const saved = getSavedJobs(userId);
  const index = saved.findIndex((j) => String(j.id) === String(job.id));
  let updated = [];
  let wasSaved = false;

  if (index >= 0) {
    updated = saved.filter((j) => String(j.id) !== String(job.id));
    wasSaved = false;
  } else {
    updated = [job, ...saved];
    wasSaved = true;
  }

  try {
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('saved-jobs-updated', { detail: { updated, wasSaved, job, userId } }));
  } catch (e) {
    console.warn('Failed to save job to localStorage:', e);
  }

  return wasSaved;
};

/**
 * Purge saved jobs for a specific user (useful on new registration or reset)
 */
export const clearSavedJobsForUser = (userId = null) => {
  if (typeof window === 'undefined') return;
  try {
    const key = resolveUserKey(userId);
    localStorage.removeItem(key);
    localStorage.removeItem('careerai_saved_jobs'); // Also purge old global key
    window.dispatchEvent(new CustomEvent('saved-jobs-updated', { detail: { updated: [], wasSaved: false, userId } }));
  } catch (e) {}
};

/**
 * Purge legacy un-scoped data
 */
export const purgeLegacySavedJobs = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('careerai_saved_jobs');
  } catch (e) {}
};
