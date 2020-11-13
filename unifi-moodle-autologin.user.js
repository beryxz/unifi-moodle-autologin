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
// @version     1.0.0
// @author      beryxz
// @description Auto log-in to moodle platform using credentials set at the top of the script
// @license     MIT
// @update      11/12/2020
// @homepageURL https://github.com/beryxz/unifi-moodle-autologin
// ==/UserScript==

//TODO: Check if credentials are invalid to prevent infinite loop

/*
 * ### README ###
 *
 * Credentials will be asked on the first run.
 * WIP: If invalid, you are going to be prompted again to insert them.
 *
 * ##############
 *
 */

async function setCredentials() {
  let user = prompt('[UniFi-Auto-Login] Insert Moodle Username'),
      pass = prompt('[UniFi-Auto-Login] Insert Moodle Password');
  await GM.setValue('username', user);
  await GM.setValue('password', pass);
}

// I guess, Set-Cookie headers are managed by the browser itself so final POST response is valid even if it says it's invalid
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
      url: "https://e-l.unifi.it/login/index.php",
      method: "GET",
      onload: (res) => {
        let loginToken = res.responseText.match(/logintoken" value="(.+?)"/)[1];

        // POST credentials and retrieve logged in session token
        let control = GM.xmlHttpRequest({
          url: "https://e-l.unifi.it/login/index.php",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: `anchor=&logintoken=${loginToken}&username=${username}&password=${password}`,
          onload: (res) => {
            // redirect to main page
            window.location.replace("https://e-l.unifi.it/");
          }
        });
      }
    });
  }
})();
