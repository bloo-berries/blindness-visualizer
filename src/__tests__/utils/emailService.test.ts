import { sendFeedbackEmailServerless, FeedbackEmailData } from '../../utils/emailService';

describe('emailService', () => {
  const originalFetch = global.fetch;
  let mockFetch: jest.Mock;

  const baseFeedbackData: FeedbackEmailData = {
    type: 'general',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message content'
  };

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('sends POST request to Formspree endpoint', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await sendFeedbackEmailServerless(baseFeedbackData);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('formspree.io');
    expect(options.method).toBe('POST');
  });

  test('sends correct headers', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await sendFeedbackEmailServerless(baseFeedbackData);

    const options = mockFetch.mock.calls[0][1];
    expect(options.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  });

  test('includes all required fields in the payload', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await sendFeedbackEmailServerless(baseFeedbackData);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.name).toBe('Test User');
    expect(body.email).toBe('test@example.com');
    expect(body.subject).toBe('Test Subject');
    expect(body.message).toBe('Test message content');
    expect(body.feedbackType).toBe('general');
    expect(body._subject).toContain('Test Subject');
    expect(body._replyto).toBe('test@example.com');
  });

  test('includes optional fields when provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const fullData: FeedbackEmailData = {
      ...baseFeedbackData,
      rating: 5,
      favoriteFeature: 'Simulator',
      userType: 'educator',
      browser: 'Chrome 120',
      accessibilityNeeds: ['screen-reader', 'high-contrast']
    };

    await sendFeedbackEmailServerless(fullData);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.rating).toBe('5');
    expect(body.favoriteFeature).toBe('Simulator');
    expect(body.userType).toBe('educator');
    expect(body.browser).toBe('Chrome 120');
    expect(body.accessibilityNeeds).toBe('screen-reader, high-contrast');
  });

  test('uses default values for missing optional fields', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await sendFeedbackEmailServerless(baseFeedbackData);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.userType).toBe('Not specified');
    expect(body.browser).toBe('Not specified');
    expect(body.favoriteFeature).toBe('Not specified');
    expect(body.rating).toBe('Not specified');
    expect(body.accessibilityNeeds).toBe('None');
  });

  test('throws error when response is not ok', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockFetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ error: 'Invalid email' })
    });

    await expect(sendFeedbackEmailServerless(baseFeedbackData))
      .rejects.toThrow('Invalid email');

    consoleSpy.mockRestore();
  });

  test('throws generic error when response error has no message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    });

    await expect(sendFeedbackEmailServerless(baseFeedbackData))
      .rejects.toThrow('Failed to send feedback');

    consoleSpy.mockRestore();
  });

  test('throws error when response contains validation errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        errors: [{ message: 'Email is required' }]
      })
    });

    await expect(sendFeedbackEmailServerless(baseFeedbackData))
      .rejects.toThrow('Email is required');

    consoleSpy.mockRestore();
  });

  test('throws generic validation error when errors array has no message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        errors: [{}]
      })
    });

    await expect(sendFeedbackEmailServerless(baseFeedbackData))
      .rejects.toThrow('Validation error');

    consoleSpy.mockRestore();
  });

  test('resolves successfully on valid response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });

    await expect(sendFeedbackEmailServerless(baseFeedbackData)).resolves.toBeUndefined();
  });

  test('propagates fetch network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    await expect(sendFeedbackEmailServerless(baseFeedbackData))
      .rejects.toThrow('Network failure');
  });

  test('subject line includes the feedback subject', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await sendFeedbackEmailServerless({
      ...baseFeedbackData,
      subject: 'Feature Request: Add more conditions'
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body._subject).toBe('The Blind Spot Feedback: Feature Request: Add more conditions');
  });
});
