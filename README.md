# Money monitoring for generally undesirable websites
The ease of ignorance with respect to time spent on websites is an inherent part of today's attention economy. This project aims to clarify one's perspective on those aspects by quantifying dedicated attention in money, based on one's personal hourly wage, instead of time.

More precisely, this goal should be achieved via a browser plugin. Users
can define what they consider undesirable websites. Time of active tabs
on said websites is then monitored and displayed.

Similar, closed-source alternatives exist. This project involves no network communication, i.e. no information is shared with either the developers or a third party.

This plugin is in development and contains bugs.

# Usage

1. Install the extension.
  - Firefox: Go to https://addons.mozilla.org/en-US/firefox/ and submit the addon. Download the signed xpi file. Go to about:addons and select the xpi file.
  - Chrome: Go to chrome://extensions and load project folder under 'load unpacked extensions'. Make sure to tick the 'Developer Mode' box in the top right-hand corner
2. Navigate to extension options.
  - Adjust hourly wage. E.g. '13'.
  - Add all websites to be considered undesirable, space-separated. E.g. 'www.facebook.com www.reddit.com'.
3. Click to $ icon in the tool bar to dis- or enable the display of spent money.

# State documentation

The local storage consists of the following fields:
- currentIsDesirable: boolean, indicating whether currently active tab is considered a desirable URL
- display: Boolean indicating whether count should be displayed.
- timeCount: dictionary from weekId to duration (TODO(kevinkle): insert unit) spent on undesirable websites
- startTime: if current website is undesirable, time since activation of said website
- wage: float representing hourly wage
- websites: a string of space-separated URL substrings that are not desirable

# Requirements
- Detect closing of a tab and browser exit and act upon: add to timeCount
- Detect idle state, i.e. when browser is 'left open' or computer is locked
- After reentry, browser has to consider current website as if it was newly accessed

# Listeners
- tabChangeListener (tabs: onActivated, onUpdated)
- windowRemovalListener (windows: onRemoved)
- idleListener (idle: onStateChanged)
