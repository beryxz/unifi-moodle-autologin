# unifi-moodle-autologin

> Userscript to automatically Log Into UniFi Moodle Platform

## What is this

After you don't reload the UniFi Moodle page for a _too short_ amount of time, you get disconnected.

This `userscript` is loaded each time you load the `e-l.unifi.it` page.

If you are already logged in, nothings happens.

But if you are disconnected it automatically login, with the credentials given in the initial prompt, and reload the page for you.

**You won't have to do anything!**

## More features

If you entered wrong `credentials` the first time, **no worry!**

After a few wrong attemps it's going to ask them again.

## How to install

### Install browser extension for userscripts

First of all you have to install the browser extension to run userscripts. I'll list the recommended ones.

| Browser  | Extension |
|----------|-----------|
| Chrome   | [Violentmonkey](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag) |
| Firefox  | [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
| Safari   | [Tampermonkey](http://tampermonkey.net/?browser=safari)  |
| Edge     | [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)  |
| Opera    | [Violentmonkey](https://violentmonkey.github.io/get-it/) |

### Install userscript

[Click here](https://github.com/beryxz/unifi-moodle-autologin/raw/main/unifi-moodle-autologin.user.js) to open the install panel.
