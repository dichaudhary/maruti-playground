export const Viewport = (function initializeViewport() {
    let deviceType;
  
    const breakpoints = {
      mobile: window.matchMedia('(max-width: 47.99rem)'),
      tablet: window.matchMedia('(min-width: 48rem) and (max-width: 63.99rem)'),
      desktop: window.matchMedia('(min-width: 64rem)'),
    };
  
    function getDeviceType() {
      if (breakpoints.mobile.matches) {
        deviceType = 'Mobile';
      } else if (breakpoints.tablet.matches) {
        deviceType = 'Tablet';
      } else {
        deviceType = 'Desktop';
      }
      return deviceType;
    }
    getDeviceType();
  
    function isDesktop() {
      return deviceType === 'Desktop';
    }
    function isMobile() {
      return deviceType === 'Mobile';
    }
    function isTablet() {
      return deviceType === 'Tablet';
    }
    return {
      getDeviceType,
      isDesktop,
      isMobile,
      isTablet,
    };
  }());
