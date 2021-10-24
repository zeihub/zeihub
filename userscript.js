// ==UserScript==
// @name         Zeihub
// @namespace    https://github.com/zeihub/zeihub/
// @version      0.2
// @description  share all the things
// @author       @zeihub
// @match        *://*/*
// @icon         
// @grant        GM.xmlHttpRequest
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.4.1/Readability.min.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.3.3/dist/purify.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.0.0/crypto-js.js
// ==/UserScript==

const pasteHosts = {
    cryptobin: {
        host: 'cryptobin.co',
        pasteWrapper: '#paste-text',
        path: 'go'
    }
}

const handleConfig = {
    read: function (key) {
        try {
            const config = JSON.parse(localStorage.zeihub)
            if (!key) {
                return config
            } else {
                return config[key]
            }
        }
        catch(error) {
            return null
        }
    },
    write: function (key, value) {
        const currentConfig = handleConfig.read()
        currentConfig[key] = value
        localStorage.zeihub = JSON.stringify(currentConfig)
    }
}

const PASTEHOST = handleConfig.read('pasteHost') || 'cryptobin'
const EXPIRY = handleConfig.read('expiry') || '1week'

function cryptArticleContent (articleContent, password) {
    const passPhrase = typeof(password) !== 'undefined' ? password : generatePassphrase()
    return {
        cryptedContent: CryptoJS.AES.encrypt(articleContent, passPhrase).toString(),
        passPhrase: passPhrase
    }
}

function createButton(innerText, id, additionalTop = 0) {
    const button = document.createElement('button')
    button.innerText = innerText
    button.id = id
    button.style.position = "fixed"
    button.style.top = `${15 + additionalTop}px`
    button.style.right = '15px'
    button.style.backgroundColor = '#993333'
    button.style.border = 'none'
    button.style.padding = '15px'
    button.style['text-transform'] = 'uppercase'
    button.style.color = 'white'
    button.style['z-index'] = 9999
    button.style.cursor = 'pointer'
    document.body.prepend(button)
    return button
}

function decryptArticleContent (cryptedContent, passPhrase) {
    try {
        const decrypted = CryptoJS.AES.decrypt(cryptedContent, passPhrase)
        return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
        const customPassPhrase = window.prompt('please enter the password for this content')
        const decrypted = CryptoJS.AES.decrypt(cryptedContent, customPassPhrase)
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
}

function createShareButton () {
    const button = createButton('Zeihub', 'zeihub')
    button.addEventListener('click', async function () {
        const articleContent = getArticleContent()
        const { cryptedContent, passPhrase } = cryptArticleContent(articleContent)
        const response = await sendToBin(cryptedContent)
        window.alert(`${response.url}#${passPhrase}`)
    })
}

function createCustomPasswordShareButton () {
    const button = createButton('Zeihub with custom password', 'zeihub2', 50)
    button.addEventListener('click', async function () {
        const articleContent = getArticleContent()
        const password = window.prompt('enter your custom password')
        const { cryptedContent, passPhrase } = cryptArticleContent(articleContent, password)
        const response = await sendToBin(cryptedContent)
        window.alert(response.url)
    })
}

function createDecryptButton () {
    const body = document.body
    const button = createButton('Unzei', 'unzei')
    button.addEventListener('click', async function () {
        const cryptedContent = getCryptedContent()
        const passPhrase = getPassPhraseFromUrl()
        const decryptedArticle = decryptArticleContent(cryptedContent, passPhrase)
        document.body.querySelector('#content-view .container').innerHTML = decryptedArticle
    })
}

function getArticleContent () {
    const documentClone = document.cloneNode(true)
    const article = new Readability(documentClone).parse()
    const cleanArticleContent = DOMPurify.sanitize(article.content)
    return cleanArticleContent
}

function getCryptedContent () {
    // todo make sure that .value works with all hosts or make this configurable
    return atob(document.querySelector(pasteHosts[PASTEHOST].pasteWrapper).value)
}

async function sendToBin (content) {
    // TODO make the body and headers configurable for various pastebins
    const { host, path } = pasteHosts[PASTEHOST]
    const result = await fetch(`https://${host}/${path}`, {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
        },
        "referrerPolicy": "no-referrer",
        "body": `pasteText=${btoa(content)}&pasteExpiry=${EXPIRY}`,
        "method": "POST",
        "mode": "cors",
    })
    return result
}

function generatePassphrase() {
    const pw1 = Math.random().toString(32).slice(2)
    const pw2 = Math.random().toString(32).slice(2)
    return `${pw1}${pw2}`
}

function getPassPhraseFromUrl () {
    return window.location.hash.replace('#', '') || 'this is totally insecure but nobody cares.'
}

(function() {
    'use strict';
    if (window.location.host === pasteHosts[PASTEHOST].host) {
        createDecryptButton()
    } else {
        createShareButton()
        createCustomPasswordShareButton()
    }
})()
