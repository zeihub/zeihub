# zeihub

This project aims to make sharing your browser content easier.

TLDR: [give me the installation instructions](#installation)

## Introduction

It may sound a little complicated overall, but it's actually quite simple. ❓

There are so-called userscript browser addons (e.g. [greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) and [tampermonkey](https://www.tampermonkey.net/)) that allow you to make changes within the window of the website you are visiting by writing the appropriate code. This way you can, for example, remove all headings on a web page or highlight a certain word in red and strong. 💪

But with such user scripts you can do much more. It is possible to customize the content of a page and add your own buttons. And on top of that, you can also determine what should happen when these buttons are clicked.

![image](https://user-images.githubusercontent.com/93053292/138568562-398d246e-72ff-4f50-9ba1-a941aae266b5.png)


Within this project we use these possibilities to send the content of the browser window shown to you encrypted to a pastebin (only if you click on the corresponding button), so that you can forward the link shown to you to a person of your choice, so that they can read the article as well. You do not send the link, but only the content of the article you read. In this way, the other person does not visit the website you visit, does not see ads, is not tracked by trackers, but only reads the content you share. In effect, it's just like manually highlighting the entire content of a web page with your mouse, copying it, and then forwarding it to a friend via email or messenger.

Drawbacks: Images might not work. 😢

# Installation

Install your favourite userscript manager and then copy & paste the code from this repository into a new script. Done. 

# Usage

As a sender: Use the ZEIHUB button for the default password and use the other button for a custom password. 

As a receiver: The content should be decrypted automatically if you click the UNZEI button and ask for a password otherwise.

# Technical information

Html from the source is chased through https://github.com/mozilla/readability and https://github.com/cure53/DOMPurify, then encrypted in the script with the default password or the given custom password, base64 encoded and loaded to the pastebin (currently https://cryptobin.co/)

# Roadmap

  1. Make this a browser addon
  2. Make the bins configurable
  3. ???
  4. profit
