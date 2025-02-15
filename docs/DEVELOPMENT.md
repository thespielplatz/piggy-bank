# Development

## Notes

### How to use Github Repo https://github.com/keep-network/electrum-client-js

- npm package could not be found
- Install via:

```bash
npm i --save @keep-network/electrum-client-js   
```

- Generate type with

```bash
npx tsc node_modules/@keep-network/electrum-client-js/src/**/*.js --moduleResolution node --module ESNext --esModuleInterop --declaration --allowJs --emitDeclarationOnly --outDir server/types/electrum-client-js \
```

- Manually update the typedefinitions 💪
