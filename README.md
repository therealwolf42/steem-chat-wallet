<h1>Steem Messenger (Beta)</h1>

> Disclaimer: Steem Messenger is currently in Beta. While careful development and testing has been done - bugs should be expected. 
<a href="https://steemit.com/@therealwolf">@therealwolf on Steem</a> with funding from <a href="https://smartsteem.com">smartsteem.com</a> cannot be held liable for unknown issues, loss of funds (SBD & STEEM) or mistakes made by the user.

![Messenger_1.png](https://steemitimages.com/DQmQ6NPUPXeqtpjp6jQ3U38RBY1Eywn3hkyk8S8znTz8Ufs/Messenger_1.png)

Steem Messenger is the easiest way to communicate with other Steem Users through the blockchain (on-chain) via transfers.

These messages (transfers)  can be sent in plain text or in encrypted format via memo-keys.

The project is currently in Beta Status and available for Windows, Mac & Linux.

Releases: https://github.com/therealwolf42/steemmessenger/releases

Bug Reports: https://github.com/therealwolf42/steemmessenger/issues

Source Code: https://github.com/therealwolf42/steemmessenger

<h1>Features</h1>

- Customized chat design - based on the look and feel of Discord.

- Messages (transfers) can be sent in plain text and encrypted format.

- The needed keys (active & memo) can be imported directly into the messenger or derived from the password, which are then saved in an encrypted format (with an encryption password) locally on the computer.

- Incoming Messages are automatically fetched every x minutes (default: 10 minutes - can be customized) and also decrypted (if messenger is unlocked - more about that below)

- The Messenger has to be unlocked in order to send any messages / decrypt new messages and will automatically lock itself after a period. (default 60 minutes - can be customized)

- Notifications for new messages (currently not working on Linux)

- Multiple accounts supported

- Steem users can be blacklisted to block transfer spammers - additionally, Smartsteem.com is providing a global-blacklist consisting of known spammers & scammers.

- Settings can be configured dynamically

---

<h1>Preview: Sending Messages</h1>

![SteemMessenger_Action.gif](https://steemitimages.com/DQmUm6dz3vBtzMH4mADrUNnsnuZc74i4h5e5DhvvZzh8XED/SteemMessenger_Action.gif)

As seen in the gif above - messaging is only possible when the wallet is unlocked and an active key imported. Encryption is only possible when the account's memo key has been imported as well.

---

<h1>Build Guide</h1>

```
# install dependencies
yarn / npm i

# serve with hot reload at localhost:9080
yarn run dev / npm run dev

# build for production
yarn run build / npm run build

Note:

Building for the OS currently only works on the specific OS - for mac on mac, windows on windows and linux on linux.
```

---

<h1>No Support & No Warranty</h1>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
