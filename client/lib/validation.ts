/**
 * Validation errors for application form
 */
export interface ValidationErrors {
  company?: string;
  role?: string;
  status?: string;
  dateApplied?: string;
  interviewDate?: string;
  interviewTime?: string;
  [key: string]: string | undefined;
}

/**
 * Validate application form data
 */
export function validateApplicationForm(data: {
  company?: string;
  role?: string;
  status?: string;
  dateApplied?: string;
  interviewDate?: string;
  interviewTime?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  // Company is required
  if (!data.company || !data.company.trim()) {
    errors.company = "Company name is required";
  }

  // Role is required
  if (!data.role || !data.role.trim()) {
    errors.role = "Role is required";
  }

  // Status must be valid
  const validStatuses = ["Applied", "Interview", "Rejected", "Offer"];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = "Invalid status";
  }

  // If interview time exists, interview date must exist
  if (data.interviewTime && data.interviewTime.trim() && !data.interviewDate) {
    errors.interviewDate = "Interview date is required when time is specified";
  }

  // If interview date exists, validate format (YYYY-MM-DD)
  if (data.interviewDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.interviewDate)) {
    errors.interviewDate = "Invalid date format";
  }

  // If interview time exists, validate format (HH:MM)
  if (data.interviewTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.interviewTime)) {
    errors.interviewTime = "Invalid time format";
  }

  return errors;
}

/**
 * Check if there are any validation errors
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

/**
 * Get the first error message
 */
export function getFirstError(errors: ValidationErrors): string | null {
  for (const [key, value] of Object.entries(errors)) {
    if (value) return value;
  }
  return null;
}
