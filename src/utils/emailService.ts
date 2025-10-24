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
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with your Formspree form endpoint

export const sendFeedbackEmailServerless = async (data: FeedbackEmailData): Promise<void> => {
  try {
    // Format the email content for Formspree
    const formData = new FormData();
    formData.append('_subject', `VisionSim Feedback: ${data.subject}`);
    formData.append('_replyto', data.email);
    formData.append('_cc', 'bloomedhealth@proton.me');
    
    // Add all the feedback data
    formData.append('Feedback Type', data.type);
    formData.append('Name', data.name);
    formData.append('Email', data.email);
    formData.append('Subject', data.subject);
    formData.append('User Type', data.userType || 'Not specified');
    formData.append('Browser', data.browser || 'Not specified');
    formData.append('Favorite Feature', data.favoriteFeature || 'Not specified');
    formData.append('Rating', data.rating?.toString() || 'Not specified');
    formData.append('Accessibility Needs', data.accessibilityNeeds?.join(', ') || 'None');
    formData.append('Message', data.message);

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }

    const result = await response.json();
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send feedback email');
  }
};
