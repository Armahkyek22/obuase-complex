// Simple analytics service that can be extended with any analytics provider
class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  init() {
    // Initialize your analytics provider here (e.g., Firebase, Mixpanel, etc.)
    this.isInitialized = true;
    console.log('Analytics initialized');
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }
    
    // Here you would typically send the event to your analytics provider
    // For example:
    // firebase.analytics().logEvent(eventName, params);
    
    // For now, we'll just log to console
    console.log(`[Analytics Event] ${eventName}`, params || '');
  }
}

export const analytics = AnalyticsService.getInstance();
