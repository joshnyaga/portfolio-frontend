class Analytics {
  private sessionId: string;
  private startTime: number = Date.now();
  private isTracking: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.setupTracking();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem("visitor_session_id", sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private setupTracking(): void {
    if (typeof window === "undefined") return;

    // Track page view on load
    this.trackPageView();

    // Track time on page when leaving
    window.addEventListener("beforeunload", () => {
      this.trackTimeOnPage(true);
    });

    // Track time on page when navigating (for SPAs)
    window.addEventListener("pagehide", () => {
      this.trackTimeOnPage(true);
    });

    // Track visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.trackTimeOnPage(false);
      }
    });

    this.isTracking = true;
  }

  public async trackPageView(customPage?: string): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const data = {
        page: customPage || window.location.pathname,
        sessionId: this.sessionId,
        screenResolution: `${screen.width}x${screen.height}`,
        timeOnPage: 0,
        exitPage: false,
      };

      await fetch("/api/visitors/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        keepalive: true,
      });

      this.startTime = Date.now();
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  public async trackTimeOnPage(exitPage: boolean = false): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);

      if (timeOnPage < 1) return; // Don't track very short sessions

      const data = {
        page: window.location.pathname,
        sessionId: this.sessionId,
        timeOnPage,
        exitPage,
      };

      await fetch("/api/visitors/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        keepalive: true,
      });
    } catch (error) {
      console.error("Failed to track time on page:", error);
    }
  }

  public trackCustomEvent(eventName: string, data: any = {}): void {
    // You can extend this for custom event tracking
    console.log("Custom event:", eventName, data);
  }
}

// Create singleton instance
export const analytics = new Analytics();
