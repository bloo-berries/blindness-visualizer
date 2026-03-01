export interface FeedbackEmailData {
  type: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating?: number;
  favoriteFeature?: string;
  userType?: string;
  browser?: string;
  accessibilityNeeds?: string[];
}

// Email service using Formspree (https://formspree.io/)
// You'll need to create a Formspree account and get a form endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqedgwly';

export const sendFeedbackEmailServerless = async (data: FeedbackEmailData): Promise<void> => {
  const payload = {
    _subject: `VisionSim Feedback: ${data.subject}`,
    _replyto: data.email,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    feedbackType: data.type,
    userType: data.userType || 'Not specified',
    browser: data.browser || 'Not specified',
    favoriteFeature: data.favoriteFeature || 'Not specified',
    rating: data.rating?.toString() || 'Not specified',
    accessibilityNeeds: data.accessibilityNeeds?.join(', ') || 'None'
  };

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('Formspree error:', response.status, result);
    throw new Error(result.error || 'Failed to send feedback');
  }

  if (result.errors) {
    // eslint-disable-next-line no-console
    console.error('Formspree validation errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'Validation error');
  }
};
