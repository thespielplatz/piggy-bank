# Piggy Bank

A small piggybank for pre coiners and run by their custodian.

<p>
  <a href="https://github.com/thespielplatz/piggy-bank/">
    <img src="https://img.shields.io/github/package-json/v/thespielplatz/piggy-bank?color=F7941E" alt="Version">
  </a>
  <a href="https://github.com/thespielplatz/piggy-bank/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/thespielplatz/piggy-bank?color=F7941E" alt="Licence">
  </a>
  <a href="https://github.com/thespielplatz/piggy-bank/stargazers">
    <img src="https://img.shields.io/github/stars/thespielplatz/piggy-bank.svg?style=flat&color=F7941E" alt="Stars">
  </a>
</p>

## Features

- add a lnbits account to view behind a pincode
- view only
- Show LNURLp (the first one via LNBits API will be chosen)
- Show LN Address
- polling

## Roadmap

- t.b.d.

## Configuration

Create a `config.json`. Example:

```json
{
  "users": [
    {
      "id": "justAnRandomString",
      "name": "John Doe",
      "accessKey": "333",
      "lnbits": {
        "url": "https://your.lnbits.com",
        "invoiceKey": "6843498d6bbd4452b5853f7abdc3dac9"
      }
    }
  ]
}
```

### Lnbits

The app automatically reads all LNURL-pay extension links. If there are none, no LNURLp is shown. If there is even a username set in the extension
a seond button will appear with `@ Address`.

## Dev

```bash
npm i
nano config.json
# copy the example and adjust lnbits account
npm run dev
```

Access the piggy bank with 333 aka `DEV`

## Support

If you like this project, give it a star! If you love it, fork it and take it out for dinner. 🌟🍽️ 

And hey, why not [send some tip love?](https://thespielplatz.com/tip-jar)
