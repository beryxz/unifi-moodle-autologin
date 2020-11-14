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
// @version     1.1.0
// @author      beryxz
// @description Auto log-in to moodle platform using credentials set at the top of the script
// @update      11/12/2020
// @homepageURL https://github.com/beryxz/unifi-moodle-autologin
// ==/UserScript==

/*
 *
 * ### README ###
 *
 * Credentials will be asked on the first run.
 * If invalid, after a few tries, you are going to be prompted again to insert them.
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
      await GM.setValue('loopbackCount', 0);
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
          onload: async (res) => {
            // check loopbackCount to prevent infiniteLoop
            lbCount = await GM.getValue('loopbackCount', 0);
            if (lbCount > 1) {
              await GM.setValue('username', ''),
              await GM.setValue('password', '');
            } else {
              await GM.setValue('loopbackCount', lbCount+1);
            }

            // redirect to main page
            window.location.replace("https://e-l.unifi.it/");
          }
        });
      }
    });

  } else {

    // Login was successful, reset loopbackCount
    await GM.setValue('loopbackCount', 0);

  }
})();
