The local storage concists of the following fields:
- currentIsDesirable: boolean, indicating whether currently active tab is considered a desirable URL
- timeCount: duration (TODO(kevinkle): insert unit) spent on undesirable websites
- startTime: if current website is undesirable, time since activation of said website
- wage: float representing hourly wage
- websites: a string of space-separated URL substrings that are not desirable
