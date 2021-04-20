// ==UserScript==
// @name        UniFi Moodle Auto Log-in
// @namespace   https://github.com/beryxz/
// @match       https://e-l.unifi.it/
// @match       https://e-l.unifi.it/?*
// @match       https://e-l.unifi.it/enrol/index.php
// @match       https://e-l.unifi.it/enrol/index.php?*
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @version     2.0.0
// @author      beryxz
// @description Auto log-in to moodle platform using credentials set at the top of the script
// @update      2021-04-20
// @homepageURL https://github.com/beryxz/unifi-moodle-autologin
// ==/UserScript==

/*
 *
 * ### README ###
 *
 * As of April 2020, it is now used the new Unified Authentication system
 *
 * Credentials will be asked on the first run.
 * If invalid, error is going to be logged in console. After a refresh you are going to be prompted again to insert them.
 *
 * ##############
 *
 */

async function setCredentials() {
  await GM.setValue('username', prompt('[UniFi-Auto-Login] Insert Moodle Username'));
  await GM.setValue('password', prompt('[UniFi-Auto-Login] Insert Moodle Password'));
}

(async () => {

  // Check if not logged in
  if (document.querySelectorAll('.login').length > 0) {

    // Check credentials and prompt for them if missing
    let username = await GM.getValue('username', ''),
        password = await GM.getValue('password', '');
    if (!username || !password) {
      console.error('[UniFi-Auto-Login] Credentials Not Set');
      await setCredentials();
    }

    // GET logintoken and new session cookie
    let control = GM.xmlHttpRequest({
      url: "https://identity.unifi.it/cas/login?service=https://e-l.unifi.it/login/index.php?authCASattras=CASattras",
      method: "GET",
      onload: (res) => {
        let execution = res.responseText.match(/name="execution" value="(.+?)"/)[1];

        // POST credentials and retrieve logged in session token
        let control = GM.xmlHttpRequest({
          url: "https://identity.unifi.it/cas/login?service=https://e-l.unifi.it/login/index.php?authCASattras=CASattras",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: `geolocation=&_eventId=submit&execution=${execution}&username=${username}&password=${password}`,
          onload: async (res) => {
            // Wrong credential return a 401 status code
            if ((res.status / 100) >= 4) {
              console.log(res);
              await GM.setValue('username', '');
              await GM.setValue('password', '');
              return
            }

            // Set-Cookie headers are managed by the browser itself
            // redirect to course page or main page
            if (/(enrol|course)/.test(window.location.pathname))
              window.location.replace("https://e-l.unifi.it/course/view.php" + window.location.search);
            else
              window.location.replace("https://e-l.unifi.it/");
          }
        });
      }
    });

  }
})();
