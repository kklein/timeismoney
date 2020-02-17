# What
Tl;dr: Money monitoring for websites of limited desirability.

The ease of ignorance with respect to time spent on websites is an inherent part
of today's attention economy. this project aims to clarify one's perspective on
those aspects by quantifying dedicated attention in money, based on one's
personal hourly wage, instead of time.

More precisely, this goal should be achieved via a browser plugin. Users
can define what they consider undesirable websites. Time of active tabs
on said websites is then monitored and displayed.

Similar, closed-source alternatives exist. This project involves no network
communication, i.e. no information is shared with either the me or a third
party.

This plugin is in development.

# How to install and use it

1. Install the extension.
  - Firefox: Go to https://addons.mozilla.org/en-US/firefox/ and submit the
  addon. Download the signed xpi file. Go to about:addons and select the xpi
  file.
  - Chrome: go to chrome://extensions and load project folder under 'load
  unpacked extensions'. Make sure to tick the 'Developer Mode' box in the
  top right-hand corner.
2. Navigate to extension options.
  - Adjust hourly wage. E.g. '13'.
  - Add all websites to be considered undesirable, space-separated. e.g.
  'www.facebook.com www.reddit.com'.
3. Click to $ icon in the tool bar to dis- or enable the display of spent money.
Note that the counter will never appear on desirable websites.

I hope to also have the extension in the chrome extension store soon. that
should allow for more convenient installation, although not from source. ;)
Stay tuned.

# How to interpret the count
* The count is cummulative for all time spent on any of the defined websites.
* The count is reset on every Monday.
* The count should only consider the most recently active tab when working with
several browser windows.
* After a fixed amount of seconds of inactivity, i.e. interactions with the
browser, no more time is added even if the most recent active website was
undesirable. The count will resume once activity is resumed.

# How it works
A spinning loop checks the currently active tab every $k$ timeintervals. At that
moment of inspection, $k$ timeintervals are added to the count. In other words,
if not all of the time between two checks was spent on undesirable websites, the
counter is overestimating lost money. Yet, this approximation should still be
'fairly' close to reality for small enough $k$.

Another spinning loop updates the visible counter display.

# State documentation
The local storage consists of the following fields:
- currentisdesirable: boolean, indicating whether currently active tab is
considered a desirable URL
- display: Boolean indicating whether count should be displayed.
- timeCount: dictionary from weekId to duration in secondsspent on undesirable
websites
- wage: float representing hourly wage
- websites: a string of space-separated URL substrings that are not desirable

# Closing remarks
I don't feel great about having to rely on spinning loops. I tried to get this
working with an event-driven paradigm, relying on listeners to browser activity
events. Unfortunately, the [idle state](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/idle)
could not be successfully detected on my machine. System locks/hibernation
never triggered events. In case you have an idea what the cause for that might
be or how to circumvent or fix it, please reach out to me.
